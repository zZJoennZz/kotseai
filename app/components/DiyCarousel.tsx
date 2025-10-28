// components/DiyCarousel.tsx
'use client';

import { useEffect, useState } from 'react';

type Vid = { id: string; title: string; thumb: string };

type Props = {
  make: string;
  model: string;
  component: string;
  action: string;
};

export default function DiyCarousel({ make, model, component, action }: Props) {
  const [vids, setVids] = useState<Vid[]>([]);

  // build query once props change
  const query = `${make} ${model} ${component} ${action} tutorial`.trim();

  useEffect(() => {
    if (!query) return;
    fetch(`/api/diy-videos?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((d) => setVids(d.items || []))
      .catch(() => setVids([]));
  }, [query]);

  if (vids.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-sm text-gray-600 mb-2">Mga DIY tutorial (YouTube):</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {vids.map((v) => (
          <a
            key={v.id}
            href={`https://www.youtube.com/watch?v=${v.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-40 rounded-lg overflow-hidden shadow hover:scale-105 transition"
          >
            <img src={v.thumb} alt={v.title} className="w-full h-24 object-cover" />
            <p className="text-xs p-2 line-clamp-2">{v.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
