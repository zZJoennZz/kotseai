// app/about/page.tsx
'use client';
import Link from 'next/link';

export default function About() {
  return (
    <div className="p-10">
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-4xl font-black text-center text-gray-900">
          Bakit Ko Ginawa ang <span className="text-orange-500">KotseAI</span>?
        </h1>

        <div className="space-y-6 text-gray-700">
          <p className="text-lg leading-relaxed">
            Noong una, nag-aalangan din ako: <strong>"May silbi ba talaga 'to? Hindi ba't mas maganda pa rin ang opinyon ng mekaniko?"</strong>
          </p>

          <p>
            At tama kayo. <span className="font-semibold text-orange-600">Walang papalit sa experience ng isang magaling na mekaniko.</span>
          </p>

          <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-900">
              Ang totoo: Hindi ito kalaban ng mekaniko. Ito ay <span className="text-orange-600">kasangkapan para sa'yo</span>.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">Ang Problema na Nakita Ko:</h2>

          <div className="grid gap-3">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 text-orange-600 rounded-full p-2 mt-1">
                <span className="font-bold">!</span>
              </div>
              <p>
                <strong>"Nasisingil ako nang sobra."</strong> - Dinala ko ang kotse para sa oil change, biglang may P5,000 na extra repairs
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 text-orange-600 rounded-full p-2 mt-1">
                <span className="font-bold">!</span>
              </div>
              <p>
                <strong>"Nakalimutan ko kung ano huling napalitan."</strong> - Hindi ko matandaan kung kailan huling pinalitan ang brake fluid
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 text-orange-600 rounded-full p-2 mt-1">
                <span className="font-bold">!</span>
              </div>
              <p>
                <strong>"Nahihiya akong magtanong."</strong> - Parang ang bobo ng tanong ko sa mekaniko
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 text-orange-600 rounded-full p-2 mt-1">
                <span className="font-bold">!</span>
              </div>
              <p>
                <strong>"Nalilito ako sa manual."</strong> - 100 pages, generic, hindi para sa driving conditions sa Pilipinas
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">Paano Ito Makakatulong:</h2>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-xl border border-orange-200">
              <h3 className="font-bold text-lg mb-2 text-gray-900">🛡️ Huwag Masingil ng Sobra</h3>
              <p className="text-gray-700">
                May checklist ka na. Pwede mong sabihin: "Check lang itong mga item sa list na 'to. Bigyan mo ako ng quote."
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-xl border border-orange-200">
              <h3 className="font-bold text-lg mb-2 text-gray-900">📝 Alalahanin ang Lahat</h3>
              <p className="text-gray-700">Personalized para sa kotse mo - hindi generic. Based sa totoong mileage at edad ng sasakyan mo.</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-xl border border-orange-200">
              <h3 className="font-bold text-lg mb-2 text-gray-900">💬 Magkaroon ng Kumpiyansa</h3>
              <p className="text-gray-700">May dala kang listahan. Hindi ka na "oo" lang nang "oo" sa sinasabi ng mekaniko.</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-xl border border-orange-200">
              <h3 className="font-bold text-lg mb-2 text-gray-900">🇵🇭 Para sa Pilipinas</h3>
              <p className="text-gray-700">Naka-base sa common na sasakyan dito - Toyota Tamaraw FX, HiAce, Crosswind, at iba pa.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-yellow-100 border border-orange-300 rounded-xl p-6 mt-6">
            <h3 className="font-bold text-xl text-gray-900 mb-4">🎯 Paano Dapat Gamitin ang KotseAI:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <p>
                  <strong>Kumuha ng checklist</strong> dito base sa details ng sasakyan mo
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <p>
                  <strong>Dalhin ito sa mekaniko</strong> at sabihin: "Patingin nito, magkano ang quote?"
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <p>
                  <strong>Ikumpara ang quote</strong> sa ibang shop kung kailangan
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <p>
                  <strong>Magpasya nang may kaalaman</strong> - hindi dahil takot o nahihiya
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 p-6 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl">
            <p className="text-xl font-bold mb-4">
              Hindi ito panghalili sa mekaniko. Ito ang <span className="text-yellow-300">kasangga mo</span> bago ka pumunta sa mekaniko.
            </p>
            <Link
              href="/"
              className="inline-block bg-yellow-300 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition duration-200"
            >
              Subukan Ngayon - Libre!
            </Link>
            <p className="text-yellow-200 text-sm mt-3">Walang login, walang bayad, walang hassle</p>
          </div>
        </div>
      </div>
    </div>
  );
}
