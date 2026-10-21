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

  // Pagination for Posters (4 per page, matching Main.dc.html grid)
  const [posterPageIndex, setPosterPageIndex] = useState(0);
  const POSTERS_PER_PAGE = 4;
  const totalPosterPages = Math.max(1, Math.ceil(posters.length / POSTERS_PER_PAGE));
  const currentPosters = posters.slice(
    posterPageIndex * POSTERS_PER_PAGE,
    (posterPageIndex + 1) * POSTERS_PER_PAGE
  );

  // Pagination for Documentation (3 per page: 1 main 4/5 + 2 stacked offset 4/3, matching Main.dc.html)
  const [docPageIndex, setDocPageIndex] = useState(0);
  const DOCS_PER_PAGE = 3;
  const totalDocPages = Math.max(1, Math.ceil(docs.length / DOCS_PER_PAGE));
  const currentDocs = docs.slice(
    docPageIndex * DOCS_PER_PAGE,
    (docPageIndex + 1) * DOCS_PER_PAGE
  );
  const docItem1 = currentDocs[0];
  const docItem2 = currentDocs[1];
  const docItem3 = currentDocs[2];

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
          {/* 5A. SECTION POSTER PAGELARAN & REPERTOAR SENI (DARK EDITORIAL) */}
          <section className="w-full bg-[#141414] text-[#FAFAFA] py-24 sm:py-32 px-6 sm:px-12 lg:px-16">
            <div className="max-w-[1320px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-5 text-[#9E9E9E]">
                    <span className="font-sans text-[12px] tracking-[0.2em] uppercase">
                      {isId ? '01 — Katalog Repertoar' : '01 — Repertoire Catalog'}
                    </span>
                    <span className="w-16 h-px bg-[#353535]" />
                  </div>
                  <h2 className="mt-7 font-serif font-normal text-4xl sm:text-5xl lg:text-[60px] leading-[1.08] text-[#FAFAFA]">
                    {isId ? 'Poster Pagelaran' : 'Performance Playbills'}
                    <br />
                    <span className="text-[#9E9E9E]">Nada Upacara Bali</span>
                  </h2>
                </div>
                <div className="lg:col-span-5 flex lg:justify-end">
                  <p className="text-[15px] sm:text-base leading-[1.7] text-[#9E9E9E] max-w-[380px]">
                    {isId
                      ? 'Arsip visual karya seni pertunjukan gamelan, kolaborasi tari, dan festival budaya yang telah kami pentaskan.'
                      : 'Visual archive of Balinese gamelan performances, dance collaborations, and cultural festivals we have staged.'}
                  </p>
                </div>
              </div>

              {/* 4-Column Poster Grid */}
              {posters && posters.length > 0 ? (
                <>
                  <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {currentPosters.map((poster, idx) => {
                      const itemNum = posterPageIndex * POSTERS_PER_PAGE + idx + 1;
                      const title = isId ? poster.titleId : (poster.titleEn || poster.titleId);
                      return (
                        <article
                          key={poster.id}
                          onClick={() => setLightboxPhoto(poster)}
                          className="group cursor-pointer flex flex-col"
                        >
                          <div className="aspect-[3/4] bg-[#1F1F1F] relative overflow-hidden">
                            <Image
                              src={poster.imageUrl}
                              alt={title || `Poster ${itemNum}`}
                              fill
                              unoptimized
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          </div>
                          <div className="mt-5 border-t border-[#1F1F1F] pt-4 flex flex-col">
                            <span className="font-sans text-[12px] tracking-[0.2em] uppercase text-[#9E9E9E]">
                              No. {String(itemNum).padStart(2, '0')}
                            </span>
                            <h3 className="mt-2 font-serif font-normal text-[20px] leading-[1.35] text-[#FAFAFA] line-clamp-2 group-hover:text-amber-200/90 transition-colors">
                              {title}
                            </h3>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* Slider & Pagination Bar */}
                  <div className="mt-14 sm:mt-16 flex items-center gap-6 sm:gap-8">
                    <span className="font-sans text-[12px] tracking-[0.2em] uppercase text-[#9E9E9E] whitespace-nowrap">
                      {String(posters.length).padStart(2, '0')} {isId ? 'Poster' : 'Posters'}
                    </span>
                    <span className="flex-1 h-px bg-[#1F1F1F] relative overflow-hidden">
                      <span
                        className="absolute left-0 top-0 h-px bg-[#FAFAFA] transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(15, ((posterPageIndex + 1) / totalPosterPages) * 100))}%`,
                        }}
                      />
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPosterPageIndex((prev) => Math.max(0, prev - 1))}
                        disabled={posterPageIndex === 0}
                        aria-label={isId ? 'Poster sebelumnya' : 'Previous poster'}
                        className="w-12 h-12 rounded-full border border-[#353535] bg-transparent text-[#FAFAFA] text-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#FAFAFA] hover:bg-white/5 transition-colors"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => setPosterPageIndex((prev) => Math.min(totalPosterPages - 1, prev + 1))}
                        disabled={posterPageIndex >= totalPosterPages - 1}
                        aria-label={isId ? 'Poster berikutnya' : 'Next poster'}
                        className="w-12 h-12 rounded-full border border-[#353535] bg-transparent text-[#FAFAFA] text-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#FAFAFA] hover:bg-white/5 transition-colors"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-12 text-[#9E9E9E] text-sm">
                  {isId ? 'Belum ada poster pagelaran yang diterbitkan.' : 'No performance posters published yet.'}
                </p>
              )}
            </div>
          </section>

          {/* 5B. SECTION DOKUMENTASI UPACARA & PANGGUNG (LIGHT EDITORIAL) */}
          <section className="w-full bg-[#FAFAFA] text-[#141414] py-24 sm:py-32 px-6 sm:px-12 lg:px-16">
            <div className="max-w-[1320px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-5 text-[#6B6B6B]">
                    <span className="font-sans text-[12px] tracking-[0.2em] uppercase">
                      {isId ? '02 — Dokumentasi Lapangan' : '02 — Field Documentation'}
                    </span>
                    <span className="w-16 h-px bg-[#D1D1D1]" />
                  </div>
                  <h2 className="mt-7 font-serif font-normal text-4xl sm:text-5xl lg:text-[60px] leading-[1.08] text-[#141414]">
                    {isId ? 'Momen Pagelaran' : 'Performance Moments'}
                    <br />
                    <span className="text-[#6B6B6B]">
                      {isId ? '& Upacara Sakral' : '& Sacred Ceremonies'}
                    </span>
                  </h2>
                </div>
                <div className="lg:col-span-5 flex lg:justify-end">
                  <p className="text-[15px] sm:text-base leading-[1.7] text-[#6B6B6B] max-w-[380px]">
                    {isId
                      ? 'Rekaman autentik penabuh gamelan, tata busana adat, dan suasana upacara tradisional Bali yang kami layani secara profesional.'
                      : 'Authentic moments of our gamelan musicians, traditional ceremonial attire, and sacred rituals professionally delivered across Bali.'}
                  </p>
                </div>
              </div>

              {/* Asymmetric Editorial Gallery */}
              {docs && docs.length > 0 ? (
                <>
                  <div className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column (7 cols): Main Featured Moment (Aspect 4/5) */}
                    {docItem1 && (
                      <figure
                        onClick={() => setLightboxPhoto(docItem1)}
                        className="lg:col-span-7 group cursor-pointer m-0"
                      >
                        <div className="aspect-[4/5] bg-[#E8E8E8] relative overflow-hidden">
                          <Image
                            src={docItem1.imageUrl}
                            alt={(isId ? docItem1.titleId : docItem1.titleEn) || 'Dokumentasi'}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                          />
                        </div>
                        <figcaption className="mt-4 flex gap-4 items-baseline text-sm text-[#6B6B6B]">
                          <span className="font-serif text-[18px] text-[#141414]">
                            {String(docPageIndex * DOCS_PER_PAGE + 1).padStart(2, '0')}
                          </span>
                          <span className="line-clamp-1 group-hover:text-[#141414] transition-colors">
                            {isId ? docItem1.titleId : (docItem1.titleEn || docItem1.titleId)}
                          </span>
                        </figcaption>
                      </figure>
                    )}

                    {/* Right Column (5 cols): 2 Offset Images (Aspect 4/3) with 96px top padding on desktop */}
                    <div className="lg:col-span-5 flex flex-col gap-10 lg:pt-24">
                      {docItem2 && (
                        <figure
                          onClick={() => setLightboxPhoto(docItem2)}
                          className="group cursor-pointer m-0"
                        >
                          <div className="aspect-[4/3] bg-[#E8E8E8] relative overflow-hidden">
                            <Image
                              src={docItem2.imageUrl}
                              alt={(isId ? docItem2.titleId : docItem2.titleEn) || 'Dokumentasi'}
                              fill
                              unoptimized
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                          </div>
                          <figcaption className="mt-4 flex gap-4 items-baseline text-sm text-[#6B6B6B]">
                            <span className="font-serif text-[18px] text-[#141414]">
                              {String(docPageIndex * DOCS_PER_PAGE + 2).padStart(2, '0')}
                            </span>
                            <span className="line-clamp-1 group-hover:text-[#141414] transition-colors">
                              {isId ? docItem2.titleId : (docItem2.titleEn || docItem2.titleId)}
                            </span>
                          </figcaption>
                        </figure>
                      )}

                      {docItem3 && (
                        <figure
                          onClick={() => setLightboxPhoto(docItem3)}
                          className="group cursor-pointer m-0 ml-auto w-full sm:w-[72%]"
                        >
                          <div className="aspect-[4/3] bg-[#E8E8E8] relative overflow-hidden">
                            <Image
                              src={docItem3.imageUrl}
                              alt={(isId ? docItem3.titleId : docItem3.titleEn) || 'Dokumentasi'}
                              fill
                              unoptimized
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 1024px) 100vw, 30vw"
                            />
                          </div>
                          <figcaption className="mt-4 flex gap-4 items-baseline text-sm text-[#6B6B6B]">
                            <span className="font-serif text-[18px] text-[#141414]">
                              {String(docPageIndex * DOCS_PER_PAGE + 3).padStart(2, '0')}
                            </span>
                            <span className="line-clamp-1 group-hover:text-[#141414] transition-colors">
                              {isId ? docItem3.titleId : (docItem3.titleEn || docItem3.titleId)}
                            </span>
                          </figcaption>
                        </figure>
                      )}
                    </div>
                  </div>

                  {/* Documentation Pagination Controls */}
                  <div className="mt-14 sm:mt-16 flex items-center gap-6 sm:gap-8">
                    <span className="font-sans text-[12px] tracking-[0.2em] uppercase text-[#6B6B6B] whitespace-nowrap">
                      {String(docs.length).padStart(2, '0')} {isId ? 'Dokumentasi' : 'Photographs'}
                    </span>
                    <span className="flex-1 h-px bg-[#D1D1D1] relative overflow-hidden">
                      <span
                        className="absolute left-0 top-0 h-px bg-[#141414] transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(15, ((docPageIndex + 1) / totalDocPages) * 100))}%`,
                        }}
                      />
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setDocPageIndex((prev) => Math.max(0, prev - 1))}
                        disabled={docPageIndex === 0}
                        aria-label={isId ? 'Dokumentasi sebelumnya' : 'Previous documentation'}
                        className="w-12 h-12 rounded-full border border-[#D1D1D1] bg-transparent text-[#141414] text-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#141414] hover:bg-black/5 transition-colors"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => setDocPageIndex((prev) => Math.min(totalDocPages - 1, prev + 1))}
                        disabled={docPageIndex >= totalDocPages - 1}
                        aria-label={isId ? 'Dokumentasi berikutnya' : 'Next documentation'}
                        className="w-12 h-12 rounded-full border border-[#D1D1D1] bg-transparent text-[#141414] text-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#141414] hover:bg-black/5 transition-colors"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-12 text-[#6B6B6B] text-sm">
                  {isId ? 'Belum ada dokumentasi acara yang diterbitkan.' : 'No ceremonial documentation published yet.'}
                </p>
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
          className="fixed inset-0 z-50 bg-[#141414]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxPhoto(null);
            }}
            aria-label={isId ? 'Tutup Pratinjau' : 'Close Preview'}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-[#FAFAFA] flex items-center justify-center transition-colors cursor-pointer border border-white/15"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
          >
            <div className="relative w-auto max-w-[90vw] max-h-[78vh] flex items-center justify-center">
              <img
                src={lightboxPhoto.imageUrl}
                alt={(isId ? lightboxPhoto.titleId : lightboxPhoto.titleEn) || 'Foto Zoom'}
                className="max-w-full max-h-[76vh] object-contain shadow-2xl"
              />
            </div>
            
            {/* Title / Description caption */}
            {((isId && lightboxPhoto.titleId) || (!isId && lightboxPhoto.titleEn)) && (
              <div className="mt-5 text-center text-[#FAFAFA] px-4 max-w-2xl">
                {lightboxPhoto.category && (
                  <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#9E9E9E] block mb-2">
                    {lightboxPhoto.category === 'poster'
                      ? (isId ? '01 — Katalog Repertoar' : '01 — Repertoire Catalog')
                      : (isId ? '02 — Dokumentasi Lapangan' : '02 — Field Documentation')}
                  </span>
                )}
                <h3 className="font-serif text-lg sm:text-xl text-[#FAFAFA] font-normal leading-relaxed">
                  {isId ? lightboxPhoto.titleId : (lightboxPhoto.titleEn || lightboxPhoto.titleId)}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer lang={lang} />
    </main>
  );
}
