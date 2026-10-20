'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useLang } from '../../hooks/useLang';

interface Company {
  nameId: string; nameEn: string;
  taglineId: string; taglineEn: string;
  descId: string; descEn: string;
  wa: string; industry: string;
  waMessageId: string; waMessageEn: string;
  portofolioLabelId: string;
  portofolioLabelEn: string;
  highlights: {
    titleId: string; titleEn: string;
    descId: string; descEn: string;
  }[];
  services: {
    titleId: string; titleEn: string;
    descId: string; descEn: string;
  }[];
}

export interface CompanyPhotoProp {
  id: number;
  imageUrl: string;
  titleId?: string | null;
  titleEn?: string | null;
  category?: string | null;
}

interface Props {
  company: Company;
  slug: string;
  photos?: CompanyPhotoProp[];
}

export default function CompanyDetailClient({ company, slug, photos = [] }: Props) {
  const { lang, setLang, isId } = useLang();
  const router = useRouter();

  // Lightbox State for Posters & High-Res Views
  const [lightboxPhoto, setLightboxPhoto] = useState<CompanyPhotoProp | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxPhoto(null);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Separate NUB photos into Posters and Documentation
  const isNUB = slug === 'nada-upacara-bali';
  const posters = isNUB ? photos.filter((p) => p.category === 'poster') : [];
  const docs = isNUB ? photos.filter((p) => p.category !== 'poster') : photos;

  // Split documentation into featured (first 5 for editorial grid) and remaining for slider
  const featuredDoc = docs[0];
  const gridDocs = docs.slice(1, 5);
  const remainingDocs = docs.slice(5);

  return (
    <main>
      <Navbar lang={lang} setLang={setLang} />

      {/* 1. Hero */}
      <section className="w-full bg-gray-50 pt-28 sm:pt-36 pb-16 sm:pb-24 px-6 sm:px-8">
        <div className="max-w-[1440px] mx-auto">
          <button
            onClick={() => router.push('/#companies')}
            className="text-sm font-medium text-gray-600 hover:text-gray-950 transition-colors mb-8 flex items-center gap-2 cursor-pointer w-fit py-1.5 px-3 rounded-full bg-white/80 border border-gray-200 hover:border-gray-400"
          >
            ← {isId ? 'Kembali ke Perusahaan Kami' : 'Back to Our Companies'}
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center">
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
            <div className="w-full aspect-square bg-gray-200 relative overflow-hidden">
              <Image
                src={`/images/companies/${slug}.png`}
                alt={isId ? company.nameId : company.nameEn}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'contain' }}
              />
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
          <div className="w-full aspect-video bg-gray-200 relative overflow-hidden">
            <Image
              src={`/images/companies/${slug}.png`}
              alt={isId ? company.nameId : company.nameEn}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>

      {/* 3. Keunggulan Kami (Highlights) */}
      {company.highlights && company.highlights.length > 0 && (
        <section className="w-full bg-gray-50 py-24 px-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="mb-16">
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
                {isId ? 'Keunggulan Kami' : 'Why Choose Us'}
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {isId ? 'Mengapa Memilih Kami' : 'Our Key Strengths'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {company.highlights.map((h, i) => (
                <div key={i} className="flex flex-col gap-4 p-8 bg-white border border-gray-100">
                  <span className="text-2xl font-bold text-gray-900">0{i + 1}</span>
                  <h3 className="text-lg font-bold text-gray-900">
                    {isId ? h.titleId : h.titleEn}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {isId ? h.descId : h.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Apa yang Kami Tawarkan (Services) */}
      <section className="w-full bg-white py-24 px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16">
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
              {isId ? 'Layanan Kami' : 'Services'}
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

      {/* ======================================================== */}
      {/* 5. KHUSUS NADA UPACARA BALI (NUB): 2 SECTION TERPISAH   */}
      {/* ======================================================== */}
      {isNUB ? (
        <>
          {/* 5A. SECTION POSTER PAGELARAN & REPERTOAR SENI */}
          <section className="w-full bg-[#18181b] text-white py-24 px-6 sm:px-8 relative overflow-hidden">
            {/* Subtle decorative glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-[1440px] mx-auto relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs tracking-[0.2em] uppercase font-semibold mb-3">
                    <span>🎭</span>
                    <span>{isId ? 'Katalog Repertoar & Publikasi' : 'Repertoire Catalog & Playbills'}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    {isId ? 'Poster Pagelaran Nada Upacara Bali' : 'Performance & Event Posters'}
                  </h2>
                  <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
                    {isId
                      ? 'Arsip visual poster karya seni pertunjukan gamelan, kolaborasi tari, dan festival budaya yang telah kami pentaskan. Klik poster untuk melihat tampilan penuh.'
                      : 'Visual archive of Balinese gamelan performances, dance collaborations, and cultural festivals we have staged. Click any poster to view in full resolution.'}
                  </p>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline">{isId ? 'Geser ke samping untuk menjelajah' : 'Scroll horizontally to explore'}</span>
                  <span className="text-amber-400">→</span>
                </div>
              </div>

              {/* Horizontal Scroll of Vertical Posters (Aspect 3:4) */}
              <div
                className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}
              >
                {posters && posters.length > 0 ? (
                  posters.map((poster, i) => (
                    <div
                      key={poster.id}
                      onClick={() => setLightboxPhoto(poster)}
                      className="group flex-shrink-0 snap-start w-56 sm:w-64 aspect-[3/4] bg-zinc-900 border border-zinc-800 rounded-xl relative overflow-hidden shadow-lg hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-end"
                    >
                      <Image
                        src={poster.imageUrl}
                        alt={(isId ? poster.titleId : poster.titleEn) || `NUB Poster ${i + 1}`}
                        fill
                        unoptimized
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 224px, 256px"
                      />
                      
                      {/* Gradient Vignette & Title Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity p-4 flex flex-col justify-end">
                        <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold mb-1">
                          Repertoar #{i + 1}
                        </span>
                        <p className="text-xs font-medium text-white line-clamp-2 leading-snug">
                          {isId ? poster.titleId : (poster.titleEn || poster.titleId)}
                        </p>
                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-300/80 font-medium group-hover:text-amber-300 transition-colors">
                          <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                          <span>{isId ? 'Perbesar Poster' : 'Zoom Poster'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">{isId ? 'Belum ada poster pagelaran yang diterbitkan.' : 'No performance posters published yet.'}</p>
                )}
              </div>
            </div>
          </section>

          {/* 5B. SECTION DOKUMENTASI UPACARA & PANGGUNG (EDITORIAL SHOWCASE) */}
          <section className="w-full bg-gray-50 py-24 px-6 sm:px-8">
            <div className="max-w-[1440px] mx-auto">
              <div className="mb-14 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200/80 text-gray-700 text-xs tracking-[0.2em] uppercase font-semibold mb-3">
                  <span>📸</span>
                  <span>{isId ? 'Dokumentasi Lapangan' : 'Live Ceremonies & Events'}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  {isId ? 'Momen Pagelaran & Upacara Sakral' : 'Live Ceremonial & Stage Moments'}
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
                  {isId
                    ? 'Rekaman autentik penabuh gamelan, tata busana adat, dan kekhidmatan suasana upacara tradisional Bali yang telah kami layani secara profesional.'
                    : 'Authentic moments of our gamelan musicians, traditional ceremonial attire, and sacred rituals professionally delivered across Bali.'}
                </p>
              </div>

              {/* Dynamic Asymmetric Editorial Grid */}
              {docs && docs.length > 0 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Featured Large Stage Photo (7 Cols) */}
                    {featuredDoc && (
                      <div
                        onClick={() => setLightboxPhoto(featuredDoc)}
                        className="group lg:col-span-7 bg-gray-900 rounded-2xl relative overflow-hidden min-h-[380px] sm:min-h-[460px] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end"
                      >
                        <Image
                          src={featuredDoc.imageUrl}
                          alt={(isId ? featuredDoc.titleId : featuredDoc.titleEn) || 'Dokumentasi Utama NUB'}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-6 sm:p-8 flex flex-col justify-end">
                          <span className="w-fit text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-amber-500 text-gray-950 mb-2">
                            {isId ? 'Momen Sorotan' : 'Featured Moment'}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2">
                            {isId ? featuredDoc.titleId : (featuredDoc.titleEn || featuredDoc.titleId)}
                          </h3>
                        </div>
                      </div>
                    )}

                    {/* 2x2 Grid Supporting Moments (5 Cols) */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-5">
                      {gridDocs.map((docItem, idx) => (
                        <div
                          key={docItem.id}
                          onClick={() => setLightboxPhoto(docItem)}
                          className="group aspect-square bg-gray-200 rounded-xl relative overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
                        >
                          <Image
                            src={docItem.imageUrl}
                            alt={(isId ? docItem.titleId : docItem.titleEn) || `Dokumentasi NUB ${idx + 2}`}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                            <p className="text-[11px] font-medium text-white line-clamp-2 leading-tight">
                              {isId ? docItem.titleId : (docItem.titleEn || docItem.titleId)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Horizontal Glide for Remaining Documentation */}
                  {remainingDocs.length > 0 && (
                    <div className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                          {isId ? 'Arsip Dokumentasi Tambahan' : 'More Ceremonial Moments'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {isId ? 'Geser untuk melihat semua →' : 'Scroll to view all →'}
                        </span>
                      </div>
                      <div
                        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {remainingDocs.map((docItem, idx) => (
                          <div
                            key={docItem.id}
                            onClick={() => setLightboxPhoto(docItem)}
                            className="flex-shrink-0 snap-start w-72 sm:w-80 aspect-[16/10] bg-gray-200 rounded-xl relative overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group"
                          >
                            <Image
                              src={docItem.imageUrl}
                              alt={(isId ? docItem.titleId : docItem.titleEn) || `Dokumentasi NUB ${idx + 6}`}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 288px, 320px"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-6 text-white">
                              <p className="text-xs font-medium tracking-wide line-clamp-1">
                                {isId ? docItem.titleId : (docItem.titleEn || docItem.titleId)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">{isId ? 'Belum ada dokumentasi acara yang diterbitkan.' : 'No ceremonial documentation published yet.'}</p>
              )}
            </div>
          </section>
        </>
      ) : (
        /* ======================================================== */
        /* 5. UNTUK 5 ANAK PERUSAHAAN LAINNYA (STANDARD GALLERY)    */
        /* ======================================================== */
        <section className="w-full bg-gray-50 py-24 px-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="mb-16">
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
                {isId ? company.portofolioLabelId : company.portofolioLabelEn}
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {isId ? `${company.portofolioLabelId} Kami` : `Our ${company.portofolioLabelEn}`}
              </h2>
            </div>
            {/* Horizontal scroll galeri */}
            <div
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {photos && photos.length > 0 ? (
                photos.map((photo, i) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxPhoto(photo)}
                    className="flex-shrink-0 snap-start w-72 sm:w-80 aspect-square bg-gray-200 relative overflow-hidden rounded-xs group shadow-xs hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <Image
                      src={photo.imageUrl}
                      alt={(isId ? photo.titleId : photo.titleEn) || `${company.nameId} Photo ${i + 1}`}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 288px, 320px"
                    />
                    {((isId && photo.titleId) || (!isId && photo.titleEn)) && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10 text-white">
                        <p className="text-xs font-medium tracking-wide">
                          {isId ? photo.titleId : (photo.titleEn || photo.titleId)}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 snap-start w-72 aspect-square bg-gray-200/80 border border-dashed border-gray-300 flex flex-col items-center justify-center p-4 text-center"
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                      <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
                      <path d="M21 15l-5-5L5 21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-gray-400 text-xs font-medium">
                      {isId ? `Koleksi ${company.portofolioLabelId} ${i}` : `${company.portofolioLabelEn} Collection ${i}`}
                    </p>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-gray-400 text-right mt-4 tracking-wide">
              {isId ? 'Geser untuk lihat lebih →' : 'Scroll to see more →'}
            </p>
          </div>
        </section>
      )}

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

      {/* ======================================================== */}
      {/* LIGHTBOX MODAL (ZOOM DISPLAY)                            */}
      {/* ======================================================== */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxPhoto(null);
            }}
            aria-label="Tutup Pratinjau"
            className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
          >
            <div className="relative w-auto max-w-[90vw] max-h-[80vh] flex items-center justify-center">
              <img
                src={lightboxPhoto.imageUrl}
                alt={(isId ? lightboxPhoto.titleId : lightboxPhoto.titleEn) || 'Foto Zoom'}
                className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
            
            {/* Title / Description caption */}
            {((isId && lightboxPhoto.titleId) || (!isId && lightboxPhoto.titleEn)) && (
              <div className="mt-4 text-center text-white px-4">
                <p className="text-sm sm:text-base font-medium">
                  {isId ? lightboxPhoto.titleId : (lightboxPhoto.titleEn || lightboxPhoto.titleId)}
                </p>
                {lightboxPhoto.category && (
                  <span className="inline-block mt-1 text-[11px] font-mono tracking-wider text-amber-400 uppercase">
                    {lightboxPhoto.category === 'poster' ? '🎭 Poster Pagelaran Seni' : '📸 Dokumentasi Lapangan'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer lang={lang} />
    </main>
  );
}
