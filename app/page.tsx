// app/page.tsx
'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from './contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [make, setMake] = useState('');
  const [transmission, setTransmission] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mile, setMile] = useState('');
  const [loc, setLoc] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [lastMaintenanceKm, setLastMaintenanceKm] = useState('');
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState('');
  const authContext = useContext(AuthContext);

  const carsList = {
    Abarth: ['595 (Gasoline)'],
    'Alfa Romeo': ['Giulia (Gasoline)', 'Stelvio (Gasoline)'],
    Audi: ['A4 (Gasoline)', 'A6 (Gasoline)', 'Q3 (Gasoline)', 'Q5 (Gasoline)'],
    Austin: ['Mini (Gasoline)'],
    BMW: ['3 Series (Gasoline)', '5 Series (Gasoline)', 'X1 (Gasoline)', 'X3 (Gasoline)', 'X5 (Gasoline)'],
    BYD: ['Dolphin (Electric)', 'Han (Gasoline/Electric hybrid)', 'Tang (Electric)', 'e-MAX 9 (Electric)'],
    Chery: ['Tiggo 2 (Gasoline)', 'Tiggo 5x (Gasoline)', 'Tiggo 8 (Gasoline)'],
    Chevrolet: ['Camaro (Gasoline)', 'Cruze (Gasoline)', 'Optra (Gasoline)', 'Spark (Gasoline)', 'Tracker (Gasoline)', 'Trailblazer (Diesel)'],
    Datsun: ['Bluebird (Gasoline)', 'Cedric (Gasoline)'],
    Fiat: ['500 (Gasoline)'],
    Ford: [
      'Cortina (Gasoline)',
      'Escape (Gasoline)',
      'Escort (Gasoline)',
      'Everest (Diesel)',
      'Focus (Gasoline)',
      'Lynx (Gasoline)',
      'Mustang (Gasoline)',
      'Ranger (Diesel)',
      'Raptor (Diesel)',
      'Territory (Gasoline)',
    ],
    Foton: ['Gratour (Diesel)', 'Thunder (Diesel)', 'Toano (Diesel)'],
    GAC: ['Aion V (Electric)', 'GS3 (Gasoline)', 'GS8 (Gasoline)'],
    Geely: ['Coolray (Gasoline)', 'Emgrand (Gasoline)', 'Okavango (Gasoline)'],
    Honda: [
      'Accord (Gasoline)',
      'BR-V (Gasoline)',
      'CR-V (Diesel)',
      'CR-V (Gasoline)',
      'City (Gasoline)',
      'Civic (Gasoline)',
      'HR-V (Gasoline)',
      'Jazz (Gasoline)',
      'Prelude (Gasoline)',
    ],
    Hyundai: [
      'Accent (Gasoline)',
      'Creta (Gasoline)',
      'Elantra (Gasoline)',
      'Santa Fe (Gasoline)',
      'Santa Fe (Diesel)',
      'Starex (Diesel)',
      'Staria (Diesel)',
      'Stargazer (Gasoline)',
      'Tucson (Diesel)',
      'Tucson (Gasoline)',
    ],
    Isuzu: [
      'Bellet (Gasoline)',
      'Crosswind (Diesel)',
      'D-Max (Diesel)',
      'Gemini (Diesel)',
      'Gemini (Gasoline)',
      'Hi-Lander (Diesel)',
      'Traviz (Diesel)',
      'Trooper (Diesel)',
      'mu-X (Diesel)',
    ],
    Jetour: ['T1 Lightning (Electric)', 'X70 (Gasoline)'],
    Kia: [
      'Carnival (Diesel)',
      'Pride (Gasoline)',
      'Rio (Gasoline)',
      'Seltos (Gasoline)',
      'Sonet (Gasoline)',
      'Sorento (Diesel)',
      'Sorento (Gasoline)',
      'Sportage (Gasoline)',
    ],
    'Land Rover': ['Defender (Diesel)', 'Discovery (Gasoline)', 'Range Rover Evoque (Gasoline)'],
    MG: ['MG 5 (Gasoline)', 'MG GT (Gasoline)', 'MG ZS (Gasoline)'],
    Mazda: [
      '323 (Gasoline)',
      '626 (Gasoline)',
      'B2200 (Diesel)',
      'BT-50 (Diesel)',
      'CX-5 (Diesel)',
      'CX-5 (Gasoline)',
      'CX-9 (Gasoline)',
      'Familia (Gasoline)',
      'Mazda3 (Gasoline)',
    ],
    'Mercedes-Benz': ['180D (Diesel)', 'A-Class (Gasoline)', 'C-Class (Gasoline)', 'E-Class (Gasoline)', 'GLE-Class (Gasoline)'],
    Mini: ['Cooper (Gasoline)', 'Countryman (Gasoline)'],
    Mitsubishi: [
      'Adventure (Diesel)',
      'Adventure (Gasoline)',
      'Colt (Diesel)',
      'Colt (Gasoline)',
      'Galant (Gasoline)',
      'L300 (Diesel)',
      'Lancer (Gasoline)',
      'Mirage (Gasoline)',
      'Montero Sport (Diesel)',
      'Pajero (Diesel)',
      'Pajero (Gasoline)',
      'Xpander (Gasoline)',
    ],
    Nissan: [
      'Almera (Gasoline)',
      'Cedric (Gasoline)',
      'Navara (Diesel)',
      'Patrol (Diesel)',
      'Patrol (Gasoline)',
      'Sentra (Gasoline)',
      'Sunny (Gasoline)',
      'Terra (Diesel)',
      'Terrano (Diesel)',
      'Terrano (Gasoline)',
      'X-Trail (Gasoline)',
    ],
    Peugeot: ['2008 (Gasoline)', '206 (Gasoline)', '3008 (Gasoline)', '5008 (Gasoline)'],
    Suzuki: [
      'Alto (Gasoline)',
      'Dzire (Gasoline)',
      'Ertiga (Gasoline)',
      'Jimny (Gasoline)',
      'Swift (Gasoline)',
      'S-Presso (Gasoline)',
      'Vitara (Diesel)',
      'Vitara (Gasoline)',
    ],
    'Tata Motors': ['Super Ace (Diesel)', 'Xenon (Diesel)'],
    Toyota: [
      'Avanza (Gasoline)',
      'Camry (Gasoline)',
      'Corolla (Gasoline)',
      'Corona (Diesel)',
      'Corona (Gasoline)',
      'Fortuner (Diesel)',
      'Fortuner (Gasoline)',
      'HiAce (Diesel)',
      'HiAce (Gasoline)',
      'Hilux (Diesel)',
      'Hilux (Gasoline)',
      'Innova (Diesel)',
      'Innova (Gasoline)',
      'Land Cruiser (Gasoline)',
      'Land Cruiser (Diesel)',
      'LiteAce (Gasoline)',
      'MasterAce (Gasoline)',
      'Raize (Gasoline)',
      'Tamaraw FX (Diesel)',
      'Tamaraw FX (Gasoline)',
      'Vios (Gasoline)',
      'Wigo (Gasoline)',
    ],
    Volkswagen: ['Beetle (Gasoline)', 'Golf (Gasoline)', 'Jetta (Gasoline)', 'Kombi (Diesel)', 'Santana (Gasoline)', 'Tiguan (Gasoline)'],
    Volvo: ['S40 (Gasoline)', 'S60 (Gasoline)', 'XC60 (Gasoline)', 'XC90 (Gasoline)'],
  };

  useEffect(() => {
    if (make && carsList[make as keyof typeof carsList]) {
      setAvailableModels(carsList[make as keyof typeof carsList]);
      setModel('');
    } else {
      setAvailableModels([]);
      setModel('');
    }
  }, [make]);

  if (!authContext) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      make,
      model,
      transmission,
      year,
      mileage: mile,
      location: loc,
      lastMaintenanceKm,
      lastMaintenanceDate,
    };
    try {
      const res = await fetch('/api/get-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert('May error sa server :(');
        return;
      }

      const data = await res.json();
      const payload = {
        make,
        model,
        transmission,
        year,
        mileage: parseInt(mile),
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
        <p className="mt-3 text-lg md:text-xl">I-enter ang kotse mo, and hayaan ang AI pag tsek para sa'yo!</p>
      </section>

      {authContext.session?.user && <p className="text-center mb-6">Welcome back! You're logged in as {authContext.session.user.email}</p>}

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xl bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Make Dropdown */}
          <select
            required
            disabled={loading}
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 bg-white text-black"
          >
            <option value="">Pumili ng Make</option>
            {Object.keys(carsList)
              .sort()
              .map((carMake) => (
                <option key={carMake} value={carMake}>
                  {carMake}
                </option>
              ))}
          </select>

          <select
            required
            disabled={loading || !make}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 bg-white text-black"
          >
            <option value="">Pumili ng Model</option>
            {availableModels.sort().map((carModel) => (
              <option key={carModel} value={carModel}>
                {carModel}
              </option>
            ))}
          </select>
        </div>
        <select
          required
          disabled={loading}
          value={transmission}
          onChange={(e) => setTransmission(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 bg-white text-black"
        >
          <option value="">Piliit ang transmission ng sasakyan</option>
          <option value="Manual Transmission">Manual Transmission</option>
          <option value="Automatic Transmission">Automatic Transmission</option>
          <option value="Continuous Variable Transmission">Continuous Variable Transmission</option>
          <option value="Dual Clutch Transmission">Dual Clutch Transmission</option>
          <option value="Automated Manual Transmission">Automated Manual Transmission</option>
          <option value="Auto Gear Shift Transmission">Auto Gear Shift Transmission</option>
        </select>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Last maintenance you remember</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              disabled={loading}
              type="number"
              placeholder="Kilometro nung last maintenance"
              value={lastMaintenanceKm}
              onChange={(e) => setLastMaintenanceKm(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
            />
            <input
              disabled={loading}
              type="date"
              value={lastMaintenanceDate}
              onChange={(e) => setLastMaintenanceDate(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer bg-black text-yellow-300 font-bold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-60 flex items-center justify-center"
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

      <footer className="mt-16 w-full max-w-2xl text-center">
        <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-sm opacity-90 mb-3">Used LLM: Gemini 2.0 Flash. Please consult your mechanic before making any decisions!</div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs opacity-70 border-t border-white/30 pt-3">
            <div>Developed by Joenn Aquilino</div>
            <Link href="/about" className="text-yellow-300 hover:text-yellow-200 transition duration-200 font-medium">
              📖 About KotseAI
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
