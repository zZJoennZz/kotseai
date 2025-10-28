// app/api/maintenance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/* ---------- helper ---------- */
type MaintenanceJSON = {
  immediate: Array<{
    component: string;
    action: string;
    interval: string;
    reason: string;
  }>;
  soon: Array<{
    component: string;
    action: string;
    interval: string;
    reason: string;
  }>;
  later: Array<{
    component: string;
    action: string;
    interval: string;
    reason: string;
  }>;
};

async function getMaintenanceListUsingAI(make: string, model: string, year: string, mileage: string, location: string): Promise<MaintenanceJSON> {
  const prompt = `You are an ASE-certified master technician.
Output MUST be pure JSON, no markdown, no commentary.

Vehicle:
- Make:  ${make}
- Model: ${model}
- Year:  ${year}
- Current odometer: ${mileage} km
- Location: ${location} (use local climate/road-salt/dust/altitude to pick severe-service schedule when applicable)
- Make sure the information is from the Philippines as much as possible
- For transmission related maintenance, please provide both automatic and manual

Instructions
1. List only maintenance items due NOW or within the next 5 000 km.
2. Use OEM severe-service intervals if the location warrants it; otherwise normal schedule.
3. Return a single JSON object with the keys:
   "immediate"  : array of items (0-90 days),
   "soon"       : array of items (91-180 days),
   "later"      : array of items (181-365 days).
4. Each array element is an object:
   {
     "component": string, // e.g. "Engine oil"
     "action"   : string, // e.g. "Replace"
     "interval" : string, // e.g. "Every 10 000 km or 6 months"
     "reason"   : string  // 1-sentence why it matters
   }
5. Arrays may be empty; do not add extra keys.
6. Output minified JSON on a single line, no back-ticks, no labels.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: { temperature: 0.2, maxOutputTokens: 1000 },
  });

  const raw = response.text?.trim() ?? '';
  console.log('Raw AI response:', raw);

  const jsonStr = raw
    .replace(/```json?/g, '')
    .replace(/```/g, '')
    .trim();
  let parsed: MaintenanceJSON;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    console.error('Bad JSON from Gemini:', jsonStr);
    throw new Error('AI returned invalid JSON');
  }

  if (!Array.isArray(parsed.immediate) || !Array.isArray(parsed.soon) || !Array.isArray(parsed.later)) {
    throw new Error('Missing required top-level arrays');
  }
  return parsed;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { make, model, year, mileage, location } = body;

    if (!make || !model || !year || !mileage || !location) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const checklist = await getMaintenanceListUsingAI(
      String(make).trim(),
      String(model).trim(),
      String(year).trim(),
      String(mileage).trim(),
      String(location).trim()
    );

    return NextResponse.json({ maintenance: checklist });
  } catch (err: any) {
    console.error('Maintenance route error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate checklist' }, { status: 500 });
  }
}
