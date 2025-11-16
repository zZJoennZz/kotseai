'use client';
import Link from 'next/link';
import DiyCarousel from '../components/DiyCarousel';
import CostEstimator from '../components/CostEstimator';
import formatNumber from '../lib/helpers/formatNumber';

type Item = {
  component: string;
  action: string;
  interval: string;
  reason: string;
};

type ChecklistItem = {
  component: string;
  action: string;
  interval: string;
  reason: string;
};

type ChecklistData = {
  make: string;
  model: string;
  transmission: string;
  year: string;
  mileage: number;
  lastMaintenanceKm?: string;
  lastMaintenanceDate?: string;
  checklist: { immediate: Item[]; soon: Item[]; later: Item[] };
};

export default function ChecklistUI({ search }: { search: URLSearchParams }) {
  const raw = search.get('data');
  if (!raw) return <NoData />;

  let payload: ChecklistData;
  try {
    payload = JSON.parse(decodeURIComponent(raw));
  } catch {
    return <NoData />;
  }

  const { make, model, year, mileage, checklist, transmission } = payload;

  const handlePrint = (checklist: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Failed to open print window. Please allow popups.');
      return;
    }

    const doc = printWindow.document;

    const html = doc.createElement('html');
    const head = doc.createElement('head');
    const style = doc.createElement('style');
    style.textContent = `
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .section { margin-bottom: 20px; }
    .item { padding: 10px; border: 1px solid #ddd; margin-bottom: 10px; }
    .cost-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .cost-table th, .cost-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  `;
    head.appendChild(style);
    html.appendChild(head);

    const body = doc.createElement('body');
    const title = doc.createElement('h1');
    title.textContent = `${checklist.year} ${checklist.make} ${checklist.model} (with ${formatNumber(checklist.mileage)} km) Maintenance Checklist`;
    body.appendChild(title);

    const createSection = (label: string, items: ChecklistItem[]): HTMLElement => {
      const section = doc.createElement('div');
      section.className = 'section';

      const heading = doc.createElement('h2');
      heading.textContent = label;
      section.appendChild(heading);

      items.forEach((item) => {
        const div = doc.createElement('div');
        div.className = 'item';
        div.innerHTML = `
        <p><strong>${item.component}</strong> - ${item.action}</p>
        <p>Interval: ${item.interval}</p>
        <p>${item.reason}</p>
      `;
        section.appendChild(div);
      });

      return section;
    };

    body.appendChild(createSection('Immediate', checklist.checklist.immediate));
    body.appendChild(createSection('Soon (Sa susunod na 3 buwan)', checklist.checklist.soon));
    body.appendChild(createSection('Later (Sa susunod na 6-12 buwan)', checklist.checklist.later));

    html.appendChild(body);
    doc.documentElement.replaceWith(html);

    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

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
              {/* <DiyCarousel make={year + ' ' + make} model={model} component={it.component} action={it.action} /> */}
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
          {year} {make} {model} ({transmission}) with {formatNumber(mileage)} km · Maintenance Checklist
        </h1>
        {(payload.lastMaintenanceKm || payload.lastMaintenanceDate) && (
          <p className="text-sm text-gray-700 mb-4">
            Last maintenance:
            {payload.lastMaintenanceKm && ` ${formatNumber(parseInt(payload.lastMaintenanceKm))} km`}
            {payload.lastMaintenanceDate && ` on ${new Date(payload.lastMaintenanceDate).toLocaleDateString()}`}
          </p>
        )}
        <div className="py-3">
          <button
            className="cursor-pointer bg-cyan-700 hover:bg-cyan-900 text-sm text-white py-2 px-3 rounded font-bold"
            onClick={() => handlePrint(payload)}
          >
            🖨️ Print Checklist
          </button>
        </div>
        <p className="mb-6">Narito ang mga kailangan mong gawin:</p>

        <Section title="🚨 AGAD NA GAWIN" items={checklist.immediate} color="text-red-700" />
        <Section title="📅 SA SUSUNOD NA 3 BUWAN" items={checklist.soon} color="text-orange-700" />
        <Section title="🗓️ SA SUSUNOD NA 6-12 BUWAN" items={checklist.later} color="text-gray-700" />

        <CostEstimator
          make={make}
          model={model}
          transmission={transmission}
          year={year}
          mileage={checklist.immediate?.[0]?.interval ?? ''}
          location="Philippines"
          checklist={checklist}
        />

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
