// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mile, setMile] = useState('');
  const [loc, setLoc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/get-maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        make,
        model,
        year,
        mileage: mile,
        location: loc,
      }),
    });

    if (!res.ok) {
      alert('May error sa server :(');
      return;
    }

    const data = await res.json();
    console.log('AI checklist:', data.maintenance); // TODO: display this
    const checklist = data.maintenance;
    router.push(`/maintenance-result?data=${encodeURIComponent(JSON.stringify(checklist))}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-300 to-orange-500 text-gray-900 flex flex-col items-center justify-center p-6">
      <section className="max-w-2xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-black drop-shadow-md">
          Kotse<span className="text-black">AI</span>
        </h1>
        <p className="mt-3 text-lg md:text-xl">I-enter ang kotse mo, ibigay ng AI ang tamang maintenance—parang barkada mong mekaniko!</p>
      </section>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xl bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            type="text"
            placeholder="Make (e.g. Toyota)"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            required
            type="text"
            placeholder="Model (e.g. Vios)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            required
            type="number"
            min={1980}
            max={2026}
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            required
            type="number"
            placeholder="Kilometro ngayon"
            value={mile}
            onChange={(e) => setMile(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <input
          required
          type="text"
          placeholder="Lugar (e.g. Quezon City)"
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button type="submit" className="w-full bg-black text-yellow-300 font-bold py-3 rounded-lg hover:bg-gray-800 transition">
          Gawin ang Maintenance List
        </button>
      </form>

      <footer className="mt-12 text-sm opacity-80">
        <div>Used LLM: Gemini 2.0 Flash. Please contact a mechanic first before proceeding with the maintenance provided!</div>
        <div className="mt-5">Developed by Joenn Aquilino</div>
      </footer>
    </main>
  );
}
