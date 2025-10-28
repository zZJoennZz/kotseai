// app/api/videos/route.ts
import { NextRequest, NextResponse } from 'next/server';

const YT_KEY = process.env.YT_KEY ?? ''; // ← remove NEXT_PUBLIC_ prefix
if (!YT_KEY) throw new Error('YOUTUBE_KEY not set');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    if (!query) return NextResponse.json({ items: [] }, { status: 400 });

    const ytUrl =
      `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet&type=video&order=relevance&maxResults=3` +
      `&q=${encodeURIComponent(query)}&key=${YT_KEY}`;

    const res = await fetch(ytUrl);
    if (!res.ok) {
      console.error('YouTube error:', res.status, await res.text());
      return NextResponse.json({ items: [] }, { status: 500 });
    }

    const data = await res.json();
    const items = (data.items || []).map((v: any) => ({
      id: v.id.videoId,
      title: v.snippet.title,
      thumb: v.snippet.thumbnails?.medium?.url || '',
    }));

    return NextResponse.json({ items });
  } catch (e) {
    console.error('Video route crash:', e);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
