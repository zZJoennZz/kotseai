// app/api/get-cost/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
type CostRow = {
  item: string;
  oemInterval: string;
  diyDifficulty: number;
  partsPhp: number;
  laborPhp: number;
  totalPhp: number;
  // Optional expandable details (will be undefined from your API)
  whyNeeded?: string;
  specialTools?: string[];
  videoUrl?: string;
  oemPartNumber?: string;
  aftermarketPrice?: number;
  surplusPrice?: number;
  costPerKm?: number;
};
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { make, model, year, mileage, location, items, transmission } = body;

    const taskList = items.map((it: { component: string; action: string }) => `${it.component} (${it.action})`).join('\n');

    const prompt = `
Generate a DIY maintenance cost analysis for a **${year} ${make} ${model}** with ${mileage} km in ${location} (${transmission}).

**Instructions:**
- Apply the **severe-service schedule** only if ${location}'s climate/conditions (extreme heat, heavy traffic, dust, salt air) explicitly warrant it per ${make}'s guidelines
- Evaluate these specific tasks for "due now or within 5,000 km" status: ${taskList}
- For **DIY Difficulty**, rate 1-5 based on THIS exact model's: component access, special tool requirements, model-specific complexity, and common DIY failure points
- **Parts pricing**: Use 2024-2025 average PH parts costs for OEM-grade components specifically for the ${year} ${make} ${model} (include all seals/gaskets/consumables)
- **Labor rate**: ₱600/hr using manufacturer-specified labor times for this exact model (not generic estimates)

Return TWO markdown tables:

**Table 1 (Main Cost Table):**
| Item | OEM Interval | DIY Difficulty (1 is easiest-5 is hardest) | Est. Parts ₱ | Est. Labor ₱ | Total ₱ |
Sort by Total ₱ descending.
Add final row: | **Grand Total** | — | — | — | — | **₱ X** |

**Table 2 (Additional Details):**
| Item | Why Needed | Special Tools | OEM Part # | Aftermarket ₱ | Surplus ₱ | Cost/km | Video URL |
Include all items from Table 1. For Special Tools, list required tools or "None".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { temperature: 0.2, maxOutputTokens: 1500 },
    });
    const raw = response.text?.trim() ?? '';

    /* ---------- Parse both tables ---------- */
    const lines = raw.split('\n').filter((l) => l.startsWith('|') && !l.includes('---'));

    // Find separator between tables (empty line or header repetition)
    const grandTotalIndex = lines.findIndex((l) => l.includes('**Grand Total**'));
    const table1Lines = lines.slice(0, grandTotalIndex + 1);

    // Find Table 2 header
    const table2Start = lines.findIndex((l) => l.includes('Why Needed'));
    const table2Lines = table2Start > -1 ? lines.slice(table2Start) : [];

    // Parse Table 1 (main costs)
    const mainRows: CostRow[] = [];
    let grandTotal = 0;

    for (const line of table1Lines) {
      const cells = line.split('|').map((c) => c.trim());
      if (cells[1] === '**Grand Total**') {
        grandTotal = Number(cells[6].replace(/[^0-9]/g, ''));
        continue;
      }
      if (cells[1] && cells[1] !== 'Item') {
        mainRows.push({
          item: cells[1],
          oemInterval: cells[2],
          diyDifficulty: Number(cells[3]),
          partsPhp: Number(cells[4].replace(/[^0-9]/g, '')),
          laborPhp: Number(cells[5].replace(/[^0-9]/g, '')),
          totalPhp: Number(cells[6].replace(/[^0-9]/g, '')),
        });
      }
    }

    // Parse Table 2 (additional details) and merge
    const detailsMap = new Map<string, any>();
    if (table2Lines.length > 1) {
      // Skip header row
      for (let i = 1; i < table2Lines.length; i++) {
        const line = table2Lines[i];
        const cells = line.split('|').map((c) => c.trim());
        if (cells[1] && cells[1] !== 'Item') {
          detailsMap.set(cells[1], {
            whyNeeded: cells[2] || undefined,
            specialTools: cells[3] && cells[3] !== 'None' ? cells[3].split(',').map((t: string) => t.trim()) : undefined,
            oemPartNumber: cells[4] || undefined,
            aftermarketPrice: cells[5] && cells[5] !== 'N/A' ? Number(cells[5].replace(/[^0-9]/g, '')) : undefined,
            surplusPrice: cells[6] && cells[6] !== 'N/A' ? Number(cells[6].replace(/[^0-9]/g, '')) : undefined,
            costPerKm: cells[7] && cells[7] !== 'N/A' ? Number(cells[7]) : undefined,
            videoUrl: cells[8] && cells[8] !== 'N/A' ? cells[8] : undefined,
          });
        }
      }
    }

    // Merge details with main rows
    const mergedRows = mainRows.map((row) => ({
      ...row,
      ...detailsMap.get(row.item),
    }));

    return NextResponse.json({ rows: mergedRows, grandTotal });
  } catch (e) {
    console.error('Cost API error:', e);
    return NextResponse.json({ rows: [], grandTotal: 0 }, { status: 500 });
  }
}
