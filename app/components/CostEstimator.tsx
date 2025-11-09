'use client';

import { useEffect, useState } from 'react';

type CostRow = {
  item: string;
  oemInterval: string;
  diyDifficulty: number;
  partsPhp: number;
  laborPhp: number;
  totalPhp: number;
};

export default function CostEstimator({
  make,
  model,
  transmission,
  year,
  mileage,
  location,
  checklist,
}: {
  make: string;
  model: string;
  transmission: string;
  year: string;
  mileage: string;
  location: string;
  checklist: { immediate: any[]; soon: any[]; later: any[] };
}) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<CostRow[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [open, setOpen] = useState(false); // accordion closed by default

  useEffect(() => {
    if (!open) return;
    setLoading(true);

    const items = [...checklist.immediate, ...checklist.soon, ...checklist.later].map((it) => ({ component: it.component, action: it.action }));

    fetch('/api/get-cost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        make,
        model,
        transmission,
        year,
        mileage,
        location,
        items, // ← just the list of tasks
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.rows) {
          setRows(d.rows);
          setGrandTotal(d.grandTotal);
        }
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [open, make, model, year, transmission, mileage, location, checklist]);

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
      >
        {open ? '▾' : '▸'} Tingnan ang Estimadong Gastos (Peso)
      </button>

      {open && (
        <div className="mt-2 bg-white/90 rounded-lg p-4 shadow">
          {loading && <p className="text-sm text-gray-600">Kinakalkula...</p>}

          {!loading && rows.length === 0 && <p className="text-sm text-gray-600">Walang cost data.</p>}

          {!loading && rows.length > 0 && (
            <>
              {/* markdown table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Item</th>
                      <th className="text-left p-2">OEM Interval</th>
                      <th className="text-center p-2">DIY Difficulty</th>
                      <th className="text-right p-2">Parts ₱</th>
                      <th className="text-right p-2">Labor ₱</th>
                      <th className="text-right p-2">Total ₱</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.item} className="border-b hover:bg-gray-50">
                        <td className="p-2">{r.item}</td>
                        <td className="p-2">{r.oemInterval}</td>
                        <td className="text-center p-2">{r.diyDifficulty}/5</td>
                        <td className="text-right p-2">₱{r.partsPhp.toLocaleString()}</td>
                        <td className="text-right p-2">₱{r.laborPhp.toLocaleString()}</td>
                        <td className="text-right p-2 font-semibold">₱{r.totalPhp.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-yellow-100">
                      <td colSpan={5} className="p-2 text-right">
                        Grand Total
                      </td>
                      <td className="text-right p-2">₱{grandTotal.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Labor rate ₱600/hr, nationally-averaged PH parts prices. Contact your trusted mechanic for final quotations.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
