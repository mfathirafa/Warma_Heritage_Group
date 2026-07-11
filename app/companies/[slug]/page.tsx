'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

type Lang = 'id' | 'en';

const companies = {
  'karya-rotan-indonesia': {
    nameId: 'Karya Rotan Indonesia',
    nameEn: 'Karya Rotan Indonesia',
    taglineId: 'Produsen & eksportir produk rotan berkualitas tinggi berbasis kearifan lokal Indonesia.',
    taglineEn: 'Producer & exporter of high-quality rattan products rooted in local Indonesian craftsmanship.',
    descId: 'Karya Rotan Indonesia adalah perusahaan yang bergerak di bidang produksi dan ekspor produk rotan berkualitas tinggi. Dengan mengutamakan kearifan lokal dan keahlian pengrajin Indonesia, kami menghadirkan produk rotan yang memenuhi standar internasional.',
    descEn: 'Karya Rotan Indonesia is a company engaged in the production and export of high-quality rattan products. By prioritizing local wisdom and the expertise of Indonesian artisans, we deliver rattan products that meet international standards.',
    wa: '6281239669880',
    industry: 'Rattan',
  },
  'rattan-export-house-indonesia': {
    nameId: 'Rattan Export House Indonesia',
    nameEn: 'Rattan Export House Indonesia',
    taglineId: 'Menghubungkan produk rotan Indonesia dengan pasar internasional secara profesional.',
    taglineEn: 'Connecting Indonesian rattan products to international markets professionally.',
    descId: 'Rattan Export House Indonesia berfokus pada ekspor produk rotan ke pasar global. Kami menjadi jembatan antara pengrajin rotan Indonesia dengan pembeli internasional, memastikan kualitas dan ketepatan waktu pengiriman.',
    descEn: 'Rattan Export House Indonesia focuses on exporting rattan products to global markets. We bridge Indonesian rattan artisans with international buyers, ensuring quality and timely delivery.',
    wa: '6281239669880',
    industry: 'Rattan Export',
  },
  'kriya-kayu-nusantara': {
    nameId: 'Kriya Kayu Nusantara',
    nameEn: 'Kriya Kayu Nusantara',
    taglineId: 'Kerajinan kayu premium berbasis kearifan dan seni budaya Nusantara.',
    taglineEn: 'Premium woodcraft based on the art and wisdom of the Nusantara archipelago.',
    descId: 'Kriya Kayu Nusantara menghadirkan kerajinan kayu premium yang terinspirasi dari kekayaan seni dan budaya Nusantara. Setiap produk dibuat dengan tangan oleh pengrajin terampil menggunakan bahan kayu pilihan.',
    descEn: 'Kriya Kayu Nusantara presents premium woodcraft inspired by the richness of Nusantara arts and culture. Each product is handcrafted by skilled artisans using selected quality wood.',
    wa: '6281239669880',
    industry: 'Woodcraft',
  },
  'nada-upacara-bali': {
    nameId: 'Nada Upacara Bali',
    nameEn: 'Nada Upacara Bali',
    taglineId: 'Penyedia lengkap kebutuhan upacara adat dan ritual keagamaan Bali.',
    taglineEn: 'Complete provider of Balinese traditional ceremonial and religious ritual needs.',
    descId: 'Nada Upacara Bali hadir sebagai penyedia terpercaya untuk kebutuhan upacara adat dan ritual keagamaan di Bali. Kami menyediakan berbagai perlengkapan upacara yang dibuat dengan penuh ketulusan dan mengikuti tradisi leluhur.',
    descEn: 'Nada Upacara Bali is a trusted provider for traditional ceremonial and religious ritual needs in Bali. We provide various ceremonial supplies made with sincerity and following ancestral traditions.',
    wa: '6281239669880',
    industry: 'Cultural & Ceremony',
  },
  'bali-menari': {
    nameId: 'Bali Menari',
    nameEn: 'Bali Menari',
    taglineId: 'Seni pertunjukan dan tari tradisional Bali yang memukau dunia.',
    taglineEn: 'Captivating Balinese traditional dance and performing arts for the world.',
    descId: 'Bali Menari adalah perusahaan seni pertunjukan yang berfokus pada pelestarian dan promosi tari tradisional Bali. Kami menghadirkan pertunjukan tari Bali yang autentik untuk berbagai acara lokal maupun internasional.',
    descEn: 'Bali Menari is a performing arts company focused on preserving and promoting traditional Balinese dance. We present authentic Balinese dance performances for various local and international events.',
    wa: '6281239669880',
    industry: 'Performing Arts',
  },
  'niaga-rasa-indonesia': {
    nameId: 'Niaga Rasa Indonesia',
    nameEn: 'Niaga Rasa Indonesia',
    taglineId: 'Usaha kuliner autentik berbasis cita rasa dan kekayaan kuliner Nusantara.',
    taglineEn: 'Authentic culinary business rooted in the rich flavors of the Nusantara archipelago.',
    descId: 'Niaga Rasa Indonesia bergerak di bidang kuliner autentik yang mengangkat cita rasa dan kekayaan kuliner Nusantara. Kami menghadirkan pengalaman kuliner yang memadukan tradisi dengan sentuhan modern.',
    descEn: 'Niaga Rasa Indonesia operates in the authentic culinary sector, elevating the flavors and richness of Nusantara cuisine. We present culinary experiences that combine tradition with a modern touch.',
    wa: '6281239669880',
    industry: 'Culinary',
  },
};

type CompanySlug = keyof typeof companies;

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('id');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved) setLang(saved);
  }, []);

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const slug = params?.slug as CompanySlug;
  const company = companies[slug];

  if (!company) {
    return (
      <main>
        <Navbar lang={lang} setLang={handleSetLang} />
        <section className="min-h-screen flex items-center justify-center bg-gray-50 pt-[72px] px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {lang === 'id' ? 'Perusahaan tidak ditemukan' : 'Company not found'}
            </h1>
            <button
              onClick={() => router.push('/#companies')}
              className="px-8 py-3 bg-gray-900 text-white text-sm tracking-widest uppercase hover:bg-gray-700 transition-colors"
            >
              {lang === 'id' ? '← Kembali' : '← Back'}
            </button>
          </div>
        </section>
        <Footer lang={lang} />
      </main>
    );
  }

  const isId = lang === 'id';

  return (
    <main>
      <Navbar lang={lang} setLang={handleSetLang} />

      {/* Hero */}
      <section className="w-full bg-gray-50 pt-[72px] py-24 px-8">
        <div className="max-w-[1440px] mx-auto">
          <button
            onClick={() => router.push('/#companies')}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 flex items-center gap-2"
          >
            ← {isId ? 'Kembali ke Perusahaan Kami' : 'Back to Our Companies'}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">
                {company.industry}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {isId ? company.nameId : company.nameEn}
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed">
                {isId ? company.taglineId : company.taglineEn}
              </p>
              <button
                onClick={() => window.open(`https://wa.me/${company.wa}`, '_blank')}
                className="w-fit px-8 py-4 bg-gray-900 text-white text-sm tracking-widest uppercase hover:bg-gray-700 transition-colors duration-300"
              >
                💬 {isId ? 'Hubungi Kami' : 'Contact Us'}
              </button>
            </div>

            <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
              <p className="text-gray-400 text-sm">[ Foto Perusahaan ]</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deskripsi */}
      <section className="w-full bg-white py-24 px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col gap-6">
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">
              {isId ? 'Tentang Perusahaan' : 'About'}
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              {isId ? company.nameId : company.nameEn}
            </h2>
            <div className="w-12 h-px bg-gray-300" />
            <p className="text-base text-gray-500 leading-relaxed">
              {isId ? company.descId : company.descEn}
            </p>
          </div>

          <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400 text-sm">[ Foto Produk ]</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-gray-50 py-24 px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {isId ? 'Tertarik Berkolaborasi?' : 'Interested in Collaborating?'}
          </h2>
          <p className="text-base text-gray-500 max-w-md leading-relaxed">
            {isId
              ? 'Hubungi kami langsung melalui WhatsApp untuk informasi lebih lanjut.'
              : 'Contact us directly via WhatsApp for more information.'}
          </p>
          <button
            onClick={() => window.open(`https://wa.me/${company.wa}`, '_blank')}
            className="px-10 py-4 bg-gray-900 text-white text-sm tracking-widest uppercase hover:bg-gray-700 transition-colors duration-300"
          >
            💬 {isId ? 'Hubungi via WhatsApp' : 'Contact via WhatsApp'}
          </button>
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  );
}