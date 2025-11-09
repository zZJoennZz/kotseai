// app/api/maintenance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/app/lib/supabase/api';

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

async function getMaintenanceListUsingAI(
  make: string,
  model: string,
  year: string,
  mileage: string,
  location: string,
  transmission: string
): Promise<MaintenanceJSON> {
  const prompt = `You are an ASE-certified master technician.
    Output MUST be pure JSON, no markdown, no commentary.

    Vehicle:
    - Make:  ${make}
    - Model: ${model}
    - Year:  ${year}
    - Transmission: ${transmission}
    - Current odometer: ${mileage} km
    - Location: ${location} (use local climate/road-salt/dust/altitude to pick severe-service schedule when applicable)
    - Make sure the information is from the Philippines as much as possible
    - Assume the car is GAS unless something is mentioned

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
    6. Output minified JSON on a single line, no back-ticks, no labels.
    7. Make sure to provide specific maintenance for ${transmission}`;

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
    const supabase = await createClient();

    // Get the user session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    const { make, model, year, mileage, location, transmission } = await req.json();

    if (!make || !model || !year || !mileage || !location || !transmission) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const checklist = await getMaintenanceListUsingAI(
      String(make).trim(),
      String(model).trim(),
      String(year).trim(),
      String(mileage).trim(),
      String(location).trim(),
      String(transmission).trim()
    );

    if (session && !error) {
      console.log('User is logged in:', session.user.email);
      const { error } = await supabase.from('checklists').insert([
        {
          user_id: session.user.id,
          make,
          model,
          transmission,
          year,
          mileage: parseInt(mileage),
          location,
          data: checklist,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error('Error saving checklist:', error);
        return NextResponse.json({ error: 'Error saving checklist. Something went wrong!' }, { status: 500 });
      }
    }

    return NextResponse.json({ maintenance: checklist });
  } catch (err: any) {
    console.error('Maintenance route error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate checklist' }, { status: 500 });
  }
}
