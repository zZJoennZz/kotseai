'use client';
import Link from 'next/link';
import DiyCarousel from '../components/DiyCarousel';

type Item = {
  component: string;
  action: string;
  interval: string;
  reason: string;
};

export default function ChecklistUI({ search }: { search: URLSearchParams }) {
  const raw = search.get('data');
  if (!raw) return <NoData />;

  let payload: {
    make: string;
    model: string;
    year: string;
    checklist: { immediate: Item[]; soon: Item[]; later: Item[] };
  };
  try {
    payload = JSON.parse(decodeURIComponent(raw));
  } catch {
    return <NoData />;
  }

  const { make, model, year, checklist } = payload;

  const Section = ({ title, items, color }: { title: string; items: Item[]; color: string }) => (
    <section className="mb-6">
      <h2 className={`text-xl font-bold mb-3 ${color}`}>{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-600">Wala pang items sa grupo na ito.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it, i) => (
            <li key={i} className="bg-white/80 rounded-lg p-4 shadow">
              <p className="font-semibold">
                {it.component} · <span className="text-gray-700">{it.action}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{it.interval}</p>
              <p className="text-sm text-gray-700 mt-2">{it.reason}</p>
              <DiyCarousel make={year + ' ' + make} model={model} component={it.component} action={it.action} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-300 to-orange-500 text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-2">
          {year} {make} {model} · Maintenance Checklist
        </h1>
        <p className="mb-6">Narito ang mga kailangan mong gawin:</p>

        <Section title="🚨 AGAD NA GAWIN" items={checklist.immediate} color="text-red-700" />
        <Section title="📅 SA SUSUNOD NA 3 BUWAN" items={checklist.soon} color="text-orange-700" />
        <Section title="🗓️ SA SUSUNOD NA 6-12 BUWAN" items={checklist.later} color="text-gray-700" />

        <div className="mt-8 text-center">
          <Link href="/" className="inline-block bg-black text-yellow-300 px-5 py-2 rounded-lg hover:bg-gray-800 transition">
            Submit New →
          </Link>
        </div>
      </div>
    </main>
  );
}

function NoData() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center">
      <div className="bg-white/90 rounded-2xl p-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-2">Walang data!</h2>
        <p className="mb-4">Bumalik sa form at subukang muli.</p>
        <Link href="/" className="inline-block bg-black text-yellow-300 px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Bumalik
        </Link>
      </div>
    </div>
  );
}
