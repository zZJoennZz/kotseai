'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  /* ---------- form fields ---------- */
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mile, setMile] = useState('');
  const [loc, setLoc] = useState('');

  /* ---------- loading flag ---------- */
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
      const payload = {
        make,
        model,
        year,
        checklist: data.maintenance,
      };
      router.push(`/maintenance-result?data=${encodeURIComponent(JSON.stringify(payload))}`);
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            type="text"
            placeholder="Make (e.g. Toyota)"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
          />
          <input
            required
            disabled={loading}
            type="text"
            placeholder="Model (e.g. Vios)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
          />
          <input
            required
            disabled={loading}
            type="number"
            min={1980}
            max={2026}
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
          />
          <input
            required
            disabled={loading}
            type="number"
            placeholder="Kilometro ngayon"
            value={mile}
            onChange={(e) => setMile(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
          />
        </div>

        <input
          required
          disabled={loading}
          type="text"
          placeholder="Lugar (e.g. Quezon City)"
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-yellow-300 font-bold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Gumagawa ng checklist…
            </>
          ) : (
            'Gawin ang Maintenance List'
          )}
        </button>
      </form>

      <footer className="mt-12 text-sm opacity-80">
        <div>Used LLM: Gemini 2.0 Flash. Please contact a mechanic first before proceeding with the maintenance provided!</div>
        <div className="mt-5">Developed by Joenn Aquilino</div>
      </footer>
    </main>
  );
}
