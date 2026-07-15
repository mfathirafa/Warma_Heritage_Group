'use client';

import { useRouter } from 'next/navigation';
import { useScrollReveal } from '../hooks/useScrollReveal';

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
    waMessageId: 'Halo%20Karya%20Rotan%20Indonesia%2C%20saya%20tertarik%20dengan%20produk%20rotan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Karya%20Rotan%20Indonesia%2C%20I%20am%20interested%20in%20your%20rattan%20products.%20Could%20you%20tell%20me%20more%3F',
  },
  {
    id: 'rattan-export-house-indonesia',
    nameId: 'Rattan Export House Indonesia',
    nameEn: 'Rattan Export House Indonesia',
    descId: 'Menghubungkan produk rotan Indonesia dengan pasar internasional secara profesional.',
    descEn: 'Connecting Indonesian rattan products to international markets professionally.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Rattan%20Export%20House%20Indonesia%2C%20saya%20tertarik%20untuk%20mengekspor%20produk%20rotan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Rattan%20Export%20House%20Indonesia%2C%20I%20am%20interested%20in%20exporting%20your%20rattan%20products.%20Could%20you%20tell%20me%20more%3F',
  },
  {
    id: 'kriya-kayu-nusantara',
    nameId: 'Kriya Kayu Nusantara',
    nameEn: 'Kriya Kayu Nusantara',
    descId: 'Kerajinan kayu premium berbasis kearifan dan seni budaya Nusantara.',
    descEn: 'Premium woodcraft based on the art and wisdom of the Nusantara archipelago.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Kriya%20Kayu%20Nusantara%2C%20saya%20tertarik%20dengan%20produk%20kerajinan%20kayu%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Kriya%20Kayu%20Nusantara%2C%20I%20am%20interested%20in%20your%20woodcraft%20products.%20Could%20you%20tell%20me%20more%3F',
  },
  {
    id: 'nada-upacara-bali',
    nameId: 'Nada Upacara Bali',
    nameEn: 'Nada Upacara Bali',
    descId: 'Penyedia lengkap kebutuhan upacara adat dan ritual keagamaan Bali.',
    descEn: 'Complete provider of Balinese traditional ceremonial and religious ritual needs.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Nada%20Upacara%20Bali%2C%20saya%20tertarik%20dengan%20layanan%20upacara%20adat%20Bali%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Nada%20Upacara%20Bali%2C%20I%20am%20interested%20in%20your%20Balinese%20ceremonial%20services.%20Could%20you%20tell%20me%20more%3F',
  },
  {
    id: 'bali-menari',
    nameId: 'Bali Menari',
    nameEn: 'Bali Menari',
    descId: 'Seni pertunjukan dan tari tradisional Bali yang memukau dunia.',
    descEn: 'Captivating Balinese traditional dance and performing arts for the world.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Bali%20Menari%2C%20saya%20tertarik%20dengan%20pertunjukan%20tari%20Bali%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Bali%20Menari%2C%20I%20am%20interested%20in%20your%20Balinese%20dance%20performances.%20Could%20you%20tell%20me%20more%3F',
  },
  {
    id: 'niaga-rasa-indonesia',
    nameId: 'Niaga Rasa Indonesia',
    nameEn: 'Niaga Rasa Indonesia',
    descId: 'Usaha kuliner autentik berbasis cita rasa dan kekayaan kuliner Nusantara.',
    descEn: 'Authentic culinary business rooted in the rich flavors of the Nusantara archipelago.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Niaga%20Rasa%20Indonesia%2C%20saya%20tertarik%20dengan%20produk%20kuliner%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Niaga%20Rasa%20Indonesia%2C%20I%20am%20interested%20in%20your%20culinary%20products.%20Could%20you%20tell%20me%20more%3F',
  },
];

export default function CompaniesSection({ lang }: CompaniesSectionProps) {
  const isId = lang === 'id';
  const router = useRouter();
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal();

  return (
    <section id="companies" className="w-full bg-white py-24 px-8">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="mb-16"
        >
          <p className={`text-xs tracking-[0.2em] text-gray-400 uppercase mb-3 reveal ${headerVisible ? 'visible' : ''}`}>
            {isId ? 'Anak Perusahaan' : 'Our Companies'}
          </p>
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 reveal reveal-delay-1 ${headerVisible ? 'visible' : ''}`}>
            {isId ? 'Perusahaan Kami' : 'Our Companies'}
          </h2>
        </div>

        {/* Grid */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {companies.map((company, index) => (
            <div
              key={company.id}
              className={`flex flex-col gap-4 group reveal reveal-delay-${(index % 3) + 1} ${gridVisible ? 'visible' : ''}`}
            >
              <div
                onClick={() => router.push(`/companies/${company.id}`)}
                className="w-full aspect-square bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
              >
                <p className="text-gray-400 text-xs">[ Foto ]</p>
              </div>

              <h3
                onClick={() => router.push(`/companies/${company.id}`)}
                className="text-base font-bold text-gray-900 cursor-pointer hover:text-gray-500 transition-colors"
              >
                {isId ? company.nameId : company.nameEn}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                {isId ? company.descId : company.descEn}
              </p>

              <a
                href={`https://wa.me/${company.wa}?text=${isId ? company.waMessageId : company.waMessageEn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-xs tracking-widest uppercase border border-gray-900 px-4 py-2 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300"
              >
                {isId ? 'Hubungi' : 'Contact'}
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}