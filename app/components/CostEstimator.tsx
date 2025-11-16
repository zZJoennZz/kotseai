'use client';

import { useEffect, useState } from 'react';

type CostRow = {
  item: string;
  oemInterval: string;
  diyDifficulty: number;
  partsPhp: number;
  laborPhp: number;
  totalPhp: number;
  // Optional expandable details (no new columns)
  whyNeeded?: string;
  specialTools?: string[];
  videoUrl?: string;
  oemPartNumber?: string;
  aftermarketPrice?: number;
  surplusPrice?: number;
  costPerKm?: number;
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
  const [open, setOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Helper functions
  const getDifficultyColor = (diff: number) => {
    if (diff <= 2) return 'text-green-600 font-bold';
    if (diff === 3) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  const getPriorityInfo = (item: string, difficulty: number) => {
    const lower = item.toLowerCase();
    if (lower.includes('preno') || lower.includes('brake') || lower.includes('tire') || lower.includes('stein')) {
      return { icon: '🔴', text: 'Safety-critical: Unahin kung limited budget' };
    }
    if (lower.includes('timing belt') || lower.includes('oil') || lower.includes('filter') || difficulty <= 2) {
      return { icon: '🟡', text: 'Prevent engine damage' };
    }
    return { icon: '🔵', text: 'Para sa ginhawa/convenience' };
  };

  const getLocationRate = (loc: string) => {
    if (loc.includes('Manila') || loc.includes('Metro')) return '₱700-800/hr';
    if (loc.includes('Cebu') || loc.includes('Davao')) return '₱600-700/hr';
    return '₱500-600/hr';
  };

  useEffect(() => {
    if (!open || hasLoaded) return;
    setLoading(true);

    const items = checklist.immediate.map((it) => ({ component: it.component, action: it.action }));

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
        items,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.rows) {
          setRows(d.rows);
          setGrandTotal(d.grandTotal);
          setHasLoaded(true);
          setLastUpdated(new Date().toLocaleDateString('tl-PH', { month: 'short', day: 'numeric', year: 'numeric' }));
        }
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [open, make, model, year, transmission, mileage, location, checklist, hasLoaded]);

  // Check for high difficulty items (safe with optional chaining)
  const hasHighDifficultyItems = rows?.some((r) => r.diyDifficulty >= 4) ?? false;

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left bg-red-200 hover:bg-red-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
      >
        {open ? '▾' : '▸'} AGAD NA GAGAWIN - Estimadong Gastos (Peso)
      </button>

      {open && (
        <div className="mt-2 bg-white/90 rounded-lg p-4 shadow">
          {/* Warning for high difficulty */}
          {hasHighDifficultyItems && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              ⚠️ <strong>Para sa bihasa lang:</strong> May item(s) na difficulty 4-5. Kailangan ng lift/jack stands. Panoorin muna safety video.
            </div>
          )}

          <p className="text-sm text-red-600 mb-3">⚠️ Ito ang mga URGENT items na kailangang ayusin kaagad.</p>

          {loading && <p className="text-sm text-gray-600">Kinakalkula...</p>}

          {!loading && rows.length === 0 && <p className="text-sm text-gray-600">Walang cost data.</p>}

          {!loading && rows.length > 0 && (
            <>
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
                    {rows.map((r) => {
                      const priority = getPriorityInfo(r.item, r.diyDifficulty);
                      return (
                        <>
                          <tr
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            key={r.item + r.diyDifficulty}
                            onClick={() => setExpandedRow(expandedRow === r.item ? null : r.item)}
                          >
                            <td className="p-2">
                              <div className="flex items-center gap-1">
                                <span className="text-xs" title={priority.text}>
                                  {priority.icon}
                                </span>
                                <span>{r.item}</span>
                                {/* {r.videoUrl && (
                                  <a
                                    href={r.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-1 text-xs text-blue-600"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    [Video]
                                  </a>
                                )} */}
                              </div>
                            </td>
                            <td className="p-2">{r.oemInterval}</td>
                            <td className={`text-center p-2 ${getDifficultyColor(r.diyDifficulty)}`}>{r.diyDifficulty}/5</td>
                            <td className="text-right p-2">₱{r.partsPhp.toLocaleString()}</td>
                            <td className="text-right p-2">₱{r.laborPhp.toLocaleString()}</td>
                            <td className="text-right p-2 font-semibold">₱{r.totalPhp.toLocaleString()}</td>
                          </tr>
                          {expandedRow === r.item && (
                            <tr className="bg-gray-50" key={r.item + r.diyDifficulty + r.whyNeeded + r.specialTools + r.oemPartNumber}>
                              <td colSpan={6} className="p-3 text-xs border-l-4 border-blue-400">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {r.whyNeeded && (
                                    <div>
                                      <strong>Bakit kailangan now?</strong> {r.whyNeeded}
                                    </div>
                                  )}
                                  {r.specialTools && r.specialTools.length > 0 && (
                                    <div>
                                      <strong>Special Tools:</strong> {r.specialTools.join(', ')}
                                    </div>
                                  )}
                                  {r.oemPartNumber && (
                                    <div>
                                      <strong>OEM Part #:</strong> {r.oemPartNumber}
                                    </div>
                                  )}
                                  {r.costPerKm && (
                                    <div>
                                      <strong>Cost/km:</strong> ₱{r.costPerKm.toFixed(2)} (mas tipid kung DIY)
                                    </div>
                                  )}
                                  {r.aftermarketPrice && (
                                    <div>
                                      <strong>Alternative:</strong> Aftermarket ₱{r.aftermarketPrice.toLocaleString()} | Surplus ₱
                                      {r.surplusPrice?.toLocaleString() || 'N/A'}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
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
                Labor rate: {getLocationRate(location)}. Nationally-averaged PH parts prices. Huling update: {lastUpdated}. Contact your trusted
                mechanic for final quotations.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
