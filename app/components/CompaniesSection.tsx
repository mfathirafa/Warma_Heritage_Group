'use client';

import Image from 'next/image';
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
    descId: 'Merancang dan memproduksi furniture, lampu, serta produk interior rotan yang disesuaikan untuk kebutuhan hotel, vila, restoran, dan berbagai ruang komersial.',
    descEn: 'Designing and manufacturing custom rattan furniture, lighting, and interior products for hotels, villas, restaurants, and commercial spaces.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Karya%20Rotan%20Indonesia%2C%20saya%20tertarik%20dengan%20produk%20rotan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Karya%20Rotan%20Indonesia%2C%20I%20am%20interested%20in%20your%20rattan%20products.%20Could%20you%20tell%20me%20more%3F',
  },
  {
    id: 'rattan-export-house-indonesia',
    nameId: 'Rattan Export House Indonesia',
    nameEn: 'Rattan Export House Indonesia',
    descId: 'Aggregator ekspor yang menyediakan solusi end-to-end untuk produk rotan Indonesia, mulai dari bahan baku, material setengah jadi, hingga produk jadi.',
    descEn: 'End-to-end export aggregator specializing in Indonesian rattan products, from raw materials and semi-finished components to finished furniture and home décor.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Rattan%20Export%20House%20Indonesia%2C%20saya%20tertarik%20untuk%20mengekspor%20produk%20rotan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Rattan%20Export%20House%20Indonesia%2C%20I%20am%20interested%20in%20exporting%20your%20rattan%20products.%20Could%20you%20tell%20me%20more%3F',
  },
  {
    id: 'kriya-kayu-nusantara',
    nameId: 'Kriya Kayu Nusantara',
    nameEn: 'Kriya Kayu Nusantara',
    descId: 'Perusahaan penyedia berbagai produk kayu, mulai dari kerajinan hingga furnitur kustom untuk kebutuhan hotel, restoran, dan proyek komersial.',
    descEn: 'Creating handcrafted wooden products ranging from artisan pieces to custom furniture for hotels, restaurants, and commercial projects.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Kriya%20Kayu%20Nusantara%2C%20saya%20tertarik%20dengan%20produk%20kerajinan%20kayu%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Kriya%20Kayu%20Nusantara%2C%20I%20am%20interested%20in%20your%20woodcraft%20products.%20Could%20you%20tell%20me%20more%3F',
  },
  {
    id: 'nada-upacara-bali',
    nameId: 'Nada Upacara Bali',
    nameEn: 'Nada Upacara Bali',
    descId: 'Menyediakan pertunjukan budaya dan layanan upacara adat Bali yang autentik untuk komunitas, industri perhotelan, dan penyelenggara acara.',
    descEn: 'Providing authentic Balinese cultural performances and ceremonial services for communities, the hospitality industry, and event organizers.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Nada%20Upacara%20Bali%2C%20saya%20tertarik%20dengan%20layanan%20upacara%20adat%20Bali%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Nada%20Upacara%20Bali%2C%20I%20am%20interested%20in%20your%20Balinese%20ceremonial%20services.%20Could%20you%20tell%20me%20more%3F',
  },
  {
    id: 'bali-menari-academy',
    nameId: 'Bali Menari Academy',
    nameEn: 'Bali Menari Academy',
    descId: 'Kelas tari tradisional dan modern untuk anak-anak maupun dewasa melalui pendekatan Joyful Learning.',
    descEn: 'Traditional and modern dance classes for children and adults through a Joyful Learning approach.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Bali%20Menari%20Academy%2C%20saya%20tertarik%20dengan%20kelas%20tari%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Bali%20Menari%20Academy%2C%20I%20am%20interested%20in%20your%20dance%20classes.%20Could%20you%20tell%20me%20more%3F',
  },
  {
    id: 'niaga-rasa-indonesia',
    nameId: 'Niaga Rasa Indonesia',
    nameEn: 'Niaga Rasa Indonesia',
    descId: 'Perusahaan ekspor yang menghubungkan produk pertanian Indonesia dengan pasar domestik dan internasional.',
    descEn: 'An export company connecting Indonesia\'s agricultural products with domestic and international markets.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Niaga%20Rasa%20Indonesia%2C%20saya%20tertarik%20dengan%20produk%20pertanian%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Niaga%20Rasa%20Indonesia%2C%20I%20am%20interested%20in%20your%20agricultural%20products.%20Could%20you%20tell%20me%20more%3F',
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
                className="w-full aspect-square bg-gray-100 relative cursor-pointer overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
              >
                <Image
                  src={`/images/companies/${company.id}.png`}
                  alt={isId ? company.nameId : company.nameEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'contain' }}
                />
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