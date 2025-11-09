// app/api/get-cost/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { make, model, year, mileage, location, items, transmission } = body;

    const taskList = items.map((it: { component: string; action: string }) => `${it.component} (${it.action})`).join('\n');

    const prompt = `
        Vehicle: ${year} ${make} ${model} ${mileage} km | ${location}
        Severe-service schedule if climate warrants.
        Specific Transmission: ${transmission}

        Tasks due now or within 5 000 km:
        ${taskList}

        Return ONLY a markdown table (no extra text) with columns:
        | Item | OEM Interval | DIY Difficulty (1 is easiest-5 is hardest) | Est. Parts ₱ | Est. Labor ₱ | Total ₱ |
        Sort by Total ₱ descending.
        Labor rate: ₱ 600 / hr. Use nationally-averaged PH parts prices.
        Add final row: | **Grand Total** | — | — | — | — | **₱ X** |
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { temperature: 0.2, maxOutputTokens: 1000 },
    });
    const raw = response.text?.trim() ?? '';

    /* ---------- very light parser ---------- */
    const lines = raw
      .split('\n')
      .filter((l) => l.startsWith('|') && !l.includes('---'))
      .slice(1); // drop header

    const rows: {
      item: string;
      oemInterval: string;
      diyDifficulty: number;
      partsPhp: number;
      laborPhp: number;
      totalPhp: number;
    }[] = [];

    let grandTotal = 0;

    for (const line of lines) {
      const cells = line.split('|').map((c) => c.trim());
      if (cells[1] === '**Grand Total**') {
        grandTotal = Number(cells[6].replace(/[^0-9]/g, ''));
        continue;
      }
      rows.push({
        item: cells[1],
        oemInterval: cells[2],
        diyDifficulty: Number(cells[3]),
        partsPhp: Number(cells[4].replace(/[^0-9]/g, '')),
        laborPhp: Number(cells[5].replace(/[^0-9]/g, '')),
        totalPhp: Number(cells[6].replace(/[^0-9]/g, '')),
      });
    }

    return NextResponse.json({ rows, grandTotal });
  } catch (e) {
    console.error('Cost API error:', e);
    return NextResponse.json({ rows: [], grandTotal: 0 }, { status: 500 });
  }
}
