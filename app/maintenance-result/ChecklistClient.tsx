'use client';

import { useSearchParams } from 'next/navigation';
import ChecklistUI from './ChecklistUI'; // the heavy presentational part

export default function ChecklistClient() {
  const search = useSearchParams();
  return <ChecklistUI search={search} />;
}
