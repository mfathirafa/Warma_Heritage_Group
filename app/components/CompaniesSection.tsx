'use client';

type Lang = 'id' | 'en';

interface CompaniesSectionProps {
  lang: Lang;
}

const companies = [
  {
    id: 'karya-rotan-indonesia',
    nameId: 'Karya Rotan Indonesia',
    nameEn: 'Karya Rotan Indonesia',
    descId: 'Produsen & eksportir produk rotan berkualitas tinggi berbasis kearifan lokal Indonesia.',
    descEn: 'Producer & exporter of high-quality rattan products rooted in local Indonesian craftsmanship.',
    wa: '6281239669880',
  },
  {
    id: 'rattan-export-house-indonesia',
    nameId: 'Rattan Export House Indonesia',
    nameEn: 'Rattan Export House Indonesia',
    descId: 'Menghubungkan produk rotan Indonesia dengan pasar internasional secara profesional.',
    descEn: 'Connecting Indonesian rattan products to international markets professionally.',
    wa: '6281239669880',
  },
  {
    id: 'kriya-kayu-nusantara',
    nameId: 'Kriya Kayu Nusantara',
    nameEn: 'Kriya Kayu Nusantara',
    descId: 'Kerajinan kayu premium berbasis kearifan dan seni budaya Nusantara.',
    descEn: 'Premium woodcraft based on the art and wisdom of the Nusantara archipelago.',
    wa: '6281239669880',
  },
  {
    id: 'nada-upacara-bali',
    nameId: 'Nada Upacara Bali',
    nameEn: 'Nada Upacara Bali',
    descId: 'Penyedia lengkap kebutuhan upacara adat dan ritual keagamaan Bali.',
    descEn: 'Complete provider of Balinese traditional ceremonial and religious ritual needs.',
    wa: '6281239669880',
  },
  {
    id: 'bali-menari',
    nameId: 'Bali Menari',
    nameEn: 'Bali Menari',
    descId: 'Seni pertunjukan dan tari tradisional Bali yang memukau dunia.',
    descEn: 'Captivating Balinese traditional dance and performing arts for the world.',
    wa: '6281239669880',
  },
  {
    id: 'niaga-rasa-indonesia',
    nameId: 'Niaga Rasa Indonesia',
    nameEn: 'Niaga Rasa Indonesia',
    descId: 'Usaha kuliner autentik berbasis cita rasa dan kekayaan kuliner Nusantara.',
    descEn: 'Authentic culinary business rooted in the rich flavors of the Nusantara archipelago.',
    wa: '6281239669880',
  },
];

export default function CompaniesSection({ lang }: CompaniesSectionProps) {
  const isId = lang === 'id';

  return (
    <section
      id="companies"
      className="w-full bg-white py-24 px-8"
    >
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
            {isId ? 'Anak Perusahaan' : 'Our Companies'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {isId ? 'Perusahaan Kami' : 'Our Companies'}
          </h2>
        </div>

        {/* Grid 3x2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex flex-col gap-4 group"
            >
              {/* Placeholder foto — persegi */}
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400 text-xs">[ Foto ]</p>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  {isId ? company.nameId : company.nameEn}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {isId ? company.descId : company.descEn}
                </p>
              </div>

              {/* CTA */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => window.location.href = `/companies/${company.id}`}
                  className="w-fit text-xs tracking-widest uppercase border border-gray-900 px-4 py-2 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300"
                >
                  {isId ? 'Selengkapnya →' : 'Learn More →'}
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/${company.wa}`, '_blank')}
                  className="w-fit text-xs tracking-widest uppercase border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-300"
                >
                  💬 {isId ? 'Hubungi' : 'Contact'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}