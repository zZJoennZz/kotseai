import { Suspense } from 'react';
import ChecklistClient from './ChecklistClient';

export default function MaintenanceResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center">
          <span className="text-white text-xl">Loading checklist…</span>
        </div>
      }
    >
      <ChecklistClient />
    </Suspense>
  );
}
