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
    descId: 'Merancang dan memproduksi furnitur, lampu, serta produk interior rotan yang disesuaikan untuk kebutuhan hotel, vila, restoran, dan berbagai ruang komersial.',
    descEn: 'Designing and manufacturing custom rattan furniture, lighting, and interior products for hotels, villas, restaurants, and commercial spaces.',
    wa: '6281239669880',
    waMessageId: 'Halo%20Karya%20Rotan%20Indonesia%2C%20saya%20tertarik%20dengan%20produk%20rotan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Karya%20Rotan%20Indonesia%2C%20I%20am%20interested%20in%20your%20rattan%20products.%20Could%20you%20tell%20me%20more%3F',
  },
  {
    id: 'rattan-export-house-indonesia',
    nameId: 'Rattan Export House Indonesia',
    nameEn: 'Rattan Export House Indonesia',
    descId: 'Agregator ekspor yang menyediakan solusi end-to-end untuk produk rotan Indonesia, mulai dari bahan baku, material setengah jadi, hingga produk jadi.',
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
    <section id="companies" className="w-full bg-white py-20 sm:py-24 px-6 sm:px-8">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="mb-14 sm:mb-16"
        >
          <p className={`text-xs tracking-[0.2em] text-gray-500 uppercase mb-3 reveal ${headerVisible ? 'visible' : ''}`}>
            {isId ? 'Anak Perusahaan' : 'Our Companies'}
          </p>
          <h2 className={`text-3xl sm:text-4xl font-serif font-bold text-gray-900 reveal reveal-delay-1 ${headerVisible ? 'visible' : ''}`}>
            {isId ? 'Perusahaan Kami' : 'Our Companies'}
          </h2>
        </div>

        {/* Grid */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {companies.map((company, index) => (
            <div
              key={company.id}
              onClick={() => router.push(`/companies/${company.id}`)}
              className={`flex flex-col justify-between gap-6 p-6 sm:p-7 bg-white border border-gray-200/90 rounded-xs hover:border-gray-900 hover:shadow-lg transition-all duration-300 group cursor-pointer reveal reveal-delay-${(index % 3) + 1} ${gridVisible ? 'visible' : ''}`}
            >
              <div className="flex flex-col gap-5">
                <div className="w-full aspect-[4/3] bg-gray-50 border border-gray-100 relative overflow-hidden flex items-center justify-center p-6 group-hover:bg-gray-100/70 transition-colors">
                  <Image
                    src={`/images/companies/${company.id}.png`}
                    alt={isId ? company.nameId : company.nameEn}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'contain' }}
                    className="p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-amber-900 transition-colors">
                    {isId ? company.nameId : company.nameEn}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {isId ? company.descId : company.descEn}
                  </p>
                </div>
              </div>

              {/* Action bar: Dual CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-gray-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>{isId ? 'Lihat Profil' : 'View Profile'}</span>
                  <span>→</span>
                </span>

                <a
                  href={`https://wa.me/${company.wa}?text=${isId ? company.waMessageId : company.waMessageEn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3.5 py-1.5 text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 rounded-xs transition-colors flex items-center gap-1.5"
                  title="Hubungi langsung via WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>{isId ? 'Hubungi' : 'Contact'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}