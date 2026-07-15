'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

type Lang = 'id' | 'en';

interface Company {
  nameId: string; nameEn: string;
  taglineId: string; taglineEn: string;
  descId: string; descEn: string;
  wa: string; industry: string;
  waMessageId: string; waMessageEn: string;
  highlights: {
    titleId: string; titleEn: string;
    descId: string; descEn: string;
  }[];
  services: {
    titleId: string; titleEn: string;
    descId: string; descEn: string;
  }[];
}

interface Props {
  company: Company;
  slug: string;
}

export default function CompanyDetailClient({ company }: Props) {
  const [lang, setLang] = useState<Lang>('id');
  const router = useRouter();
  const isId = lang === 'id';

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved) setLang(saved);
  }, []);

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <main>
      <Navbar lang={lang} setLang={handleSetLang} />

      {/* 1. Hero */}
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
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">{company.industry}</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {isId ? company.nameId : company.nameEn}
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed">
                {isId ? company.taglineId : company.taglineEn}
              </p>
              
              <a
                href={`https://wa.me/${company.wa}?text=${isId ? company.waMessageId : company.waMessageEn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit px-8 py-4 bg-gray-900 text-white text-sm tracking-widest uppercase hover:bg-gray-700 transition-colors duration-300"
              >
                {isId ? 'Hubungi Kami' : 'Contact Us'}
              </a>
            </div>
            <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
              <p className="text-gray-400 text-sm">[ Foto Perusahaan ]</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tentang Perusahaan */}
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

      {/* 3. Keunggulan Bisnis */}
      <section className="w-full bg-gray-50 py-24 px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16">
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
              {isId ? 'Keunggulan Kami' : 'Why Choose Us'}
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              {isId ? 'Mengapa Memilih Kami?' : 'Why Work With Us?'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {company.highlights.map((h, i) => (
              <div key={i} className="flex flex-col gap-4 p-8 bg-white">
                <span className="text-xs text-gray-400 tracking-widest">0{i + 1}</span>
                <h3 className="text-base font-bold text-gray-900">
                  {isId ? h.titleId : h.titleEn}
                </h3>
                <div className="w-8 h-px bg-gray-300" />
                <p className="text-sm text-gray-500 leading-relaxed">
                  {isId ? h.descId : h.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Produk / Layanan */}
      <section className="w-full bg-white py-24 px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16">
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
              {isId ? 'Produk & Layanan' : 'Products & Services'}
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              {isId ? 'Apa yang Kami Tawarkan' : 'What We Offer'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {company.services.map((s, i) => (
              <div key={i} className="flex gap-6 items-start p-8 bg-gray-50">
                <span className="text-xs text-gray-400 tracking-widest mt-1">0{i + 1}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-gray-900">
                    {isId ? s.titleId : s.titleEn}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {isId ? s.descId : s.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Galeri */}
      <section className="w-full bg-gray-50 py-24 px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16">
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
              {isId ? 'Galeri' : 'Gallery'}
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              {isId ? 'Portofolio Kami' : 'Our Portfolio'}
            </h2>
          </div>
          {/* Horizontal scroll galeri */}
          <div
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 snap-start w-72 aspect-square bg-gray-200 flex items-center justify-center"
              >
                <p className="text-gray-400 text-xs">[ Foto {i} ]</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-right mt-4 tracking-wide">
            {isId ? 'Geser untuk lihat lebih →' : 'Scroll to see more →'}
          </p>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="w-full bg-white py-24 px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {isId ? 'Tertarik Berkolaborasi?' : 'Interested in Collaborating?'}
          </h2>
          <p className="text-base text-gray-500 max-w-md leading-relaxed">
            {isId
              ? 'Hubungi kami langsung melalui WhatsApp untuk informasi lebih lanjut.'
              : 'Contact us directly via WhatsApp for more information.'}
          </p>
          
          <a
            href={`https://wa.me/${company.wa}?text=${isId ? company.waMessageId : company.waMessageEn}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-gray-900 text-white text-sm tracking-widest uppercase hover:bg-gray-700 transition-colors duration-300"
          >
            {isId ? 'Hubungi via WhatsApp' : 'Contact via WhatsApp'}
          </a>
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  );
}