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
  const authContext = useContext(AuthContext);

  const carsList = {
    Toyota: [
      'Corolla',
      'Corona',
      'Tamaraw FX',
      'Tamaraw FX (Diesel)',
      'LiteAce',
      'HiAce (Diesel)',
      'Hilux (Diesel)',
      'Camry',
      'Vios',
      'Wigo',
      'Avanza',
      'Innova',
      'Innova (Diesel)',
      'Fortuner',
      'Fortuner (Diesel)',
      'Raize',
    ],
    Mitsubishi: [
      'Lancer',
      'Galant',
      'Pajero',
      'Pajero (Diesel)',
      'Adventure',
      'Adventure (Diesel)',
      'L300 (Diesel)',
      'Montero Sport (Diesel)',
      'Mirage',
      'Xpander',
    ],
    Nissan: ['Sunny', 'Sentra', 'Patrol', 'Patrol (Diesel)', 'Terrano', 'Terrano (Diesel)', 'X-Trail', 'Navara (Diesel)', 'Almera', 'Terra (Diesel)'],
    Honda: ['Civic', 'Accord', 'City', 'CR-V', 'CR-V (Diesel)', 'Jazz', 'HR-V', 'BR-V'],
    Isuzu: ['Gemini', 'Gemini (Diesel)', 'Hi-Lander (Diesel)', 'Crosswind (Diesel)', 'D-Max (Diesel)', 'mu-X (Diesel)', 'Traviz (Diesel)'],
    Mazda: ['323', '626', 'B2200 (Diesel)', 'CX-5', 'CX-5 (Diesel)', 'CX-9', 'Mazda3', 'BT-50 (Diesel)'],
    Suzuki: ['Alto', 'Swift', 'Jimny', 'Vitara', 'Vitara (Diesel)', 'Ertiga', 'S-Presso', 'Dzire'],
    Hyundai: ['Accent', 'Elantra', 'Starex (Diesel)', 'Tucson', 'Tucson (Diesel)', 'Santa Fe', 'Santa Fe (Diesel)', 'Stargazer', 'Creta'],
    Kia: ['Pride', 'Sportage', 'Rio', 'Sorento', 'Sorento (Diesel)', 'Seltos', 'Sonet', 'Carnival (Diesel)'],
    Ford: ['Escort', 'Lynx', 'Everest (Diesel)', 'Escape', 'Focus', 'Ranger (Diesel)', 'Raptor (Diesel)', 'Territory', 'Mustang'],
    Chevrolet: ['Optra', 'Spark', 'Cruze', 'Trailblazer (Diesel)', 'Tracker', 'Camaro'],
    Volkswagen: ['Beetle', 'Golf', 'Jetta', 'Tiguan', 'Santana'],
    BMW: ['3 Series', '5 Series', 'X1', 'X3', 'X5'],
    'Mercedes-Benz': ['E-Class', 'C-Class', 'GLE-Class', 'A-Class'],
    Audi: ['A4', 'A6', 'Q3', 'Q5'],
    Peugeot: ['206', '3008', '5008', '2008'],
    Volvo: ['S40', 'S60', 'XC60', 'XC90'],
    'Land Rover': ['Defender', 'Discovery', 'Range Rover Evoque'],
    Mini: ['Cooper', 'Countryman'],
    Fiat: ['500'],
    'Alfa Romeo': ['Giulia', 'Stelvio'],
    Abarth: ['595'],
    MG: ['MG 5', 'MG ZS', 'MG GT'],
    Geely: ['Coolray', 'Okavango', 'Emgrand'],
    Chery: ['Tiggo 2', 'Tiggo 5x', 'Tiggo 8'],
    GAC: ['GS3', 'GS8', 'Aion V'],
    Jetour: ['X70', 'T1 Lightning'],
    BYD: ['Dolphin', 'Han', 'Tang', 'e-MAX 9'],
    Foton: ['Thunder', 'Gratour', 'Toano'],
    'Tata Motors': ['Super Ace', 'Xenon'],
  };

  // Update available models when make changes
  useEffect(() => {
    if (make && carsList[make as keyof typeof carsList]) {
      setAvailableModels(carsList[make as keyof typeof carsList]);
      setModel(''); // Reset model when make changes
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

          {/* Model Dropdown */}
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
