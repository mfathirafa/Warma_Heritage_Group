'use client';

import Image from 'next/image';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SocialImpact } from '../lib/notion';

type Lang = 'id' | 'en';

interface SocialImpactSectionProps {
  lang: Lang;
  impacts: SocialImpact[];
}

// Fallback lokal jika Cover di Notion kosong (dipetakan berdasarkan judul program).
const localCovers: Record<string, string> = {
  'Pemberdayaan Pengrajin Lokal': '/images/social/pemberdayaan-pengrajin-lokal.jpg',
  'Pelestarian Seni Bali': '/images/social/pelestarian-seni-bali.jpg',
  'Pemberdayaan Seniman Muda': '/images/social/pemberdayaan-seniman-muda.jpg',
  'Pelatihan Wirausaha bagi Komunitas Lokal': '/images/social/pelatihan-wirausaha-komunitas-lokal.jpg',
  'Mentorship Mahasiswa Bali melalui Program Internship': '/images/social/mentorship-mahasiswa-internship.jpg',
  'Berbagi Keceriaan di Panti Asuhan': '/images/social/berbagi-keceriaan-panti-asuhan.jpg',
  'Pemeriksaan Kesehatan bagi Lansia di Panti Jompo': '/images/social/pemeriksaan-kesehatan-lansia.jpg',
};

const fallback: SocialImpact[] = [
  {
    id: 'pengrajin',
    titleId: 'Pemberdayaan Pengrajin Lokal',
    titleEn: 'Local Artisan Empowerment',
    descId: 'Mendukung dan memberdayakan pengrajin lokal untuk menghasilkan produk berkualitas tinggi yang berdaya saing global.',
    descEn: 'Supporting and empowering local artisans to produce high-quality products with global competitiveness.',
    categoryId: 'Komunitas',
    categoryEn: 'Community',
    cover: null,
    order: 1,
  },
  {
    id: 'seni-budaya',
    titleId: 'Pelestarian Seni Budaya Bali',
    titleEn: 'Preservation of Balinese Arts',
    descId: 'Menjaga kelestarian seni dan budaya Bali melalui program edukasi, pertunjukan, dan kolaborasi komunitas.',
    descEn: 'Preserving Balinese arts and culture through education programs, performances, and community collaborations.',
    categoryId: 'Budaya',
    categoryEn: 'Culture',
    cover: null,
    order: 2,
  },
  {
    id: 'lingkungan',
    titleId: 'Program Lingkungan Berkelanjutan',
    titleEn: 'Sustainable Environment Program',
    descId: 'Menjalankan program-program nyata untuk menjaga kelestarian lingkungan dan ekosistem alam Indonesia.',
    descEn: "Running concrete programs to preserve Indonesia's natural environment and ecosystem.",
    categoryId: 'Lingkungan',
    categoryEn: 'Environment',
    cover: null,
    order: 3,
  },
];

export default function SocialImpactSection({ lang, impacts }: SocialImpactSectionProps) {
  const isId = lang === 'id';
  const displayImpacts = impacts.length > 0 ? impacts : fallback;
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: scrollRef, isVisible: scrollVisible } = useScrollReveal();

  return (
    <section id="impact" className="w-full bg-gray-100 py-24 px-8">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="mb-16"
        >
          <p className={`text-xs tracking-[0.2em] text-gray-400 uppercase mb-3 reveal ${headerVisible ? 'visible' : ''}`}>
            {isId ? 'Dampak Sosial' : 'Social Impact'}
          </p>
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 reveal reveal-delay-1 ${headerVisible ? 'visible' : ''}`}>
            {isId ? 'Kontribusi Kami untuk Masyarakat' : 'Our Contribution to Society'}
          </h2>
        </div>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef as React.RefObject<HTMLDivElement>}
          className={`reveal ${scrollVisible ? 'visible' : ''}`}
        >
          <div
            id="impact-carousel"
            className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayImpacts.map((impact) => (
              <div
                key={impact.id}
                className="flex flex-col gap-5 shrink-0 snap-start w-[85vw] sm:w-[340px] md:w-[calc(33.333%-1.25rem)] bg-white p-5 sm:p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-full aspect-[4/3] sm:aspect-square relative overflow-hidden bg-gray-100">
                  {impact.cover ? (
                    <img
                      src={impact.cover}
                      alt={isId ? impact.titleId : impact.titleEn}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : localCovers[impact.titleId] ? (
                    <Image
                      src={localCovers[impact.titleId]}
                      alt={isId ? impact.titleId : impact.titleEn}
                      fill
                      sizes="(max-width: 768px) 85vw, (max-width: 1200px) 340px, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <p className="text-gray-500 text-xs font-mono">[ Foto Kegiatan ]</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2.5">
                  <span className="text-[11px] font-semibold text-gray-500 tracking-[0.15em] uppercase">
                    {isId ? impact.categoryId : impact.categoryEn}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-gray-900 leading-snug">
                    {isId ? impact.titleId : impact.titleEn}
                  </h3>
                  <div className="w-8 h-px bg-gray-300 my-0.5" />
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {isId ? impact.descId : impact.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-xs text-gray-500 font-medium">
              {isId ? '← Geser untuk program lainnya →' : '← Swipe to view more initiatives →'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('impact-carousel');
                  if (el) el.scrollBy({ left: -340, behavior: 'smooth' });
                }}
                className="w-9 h-9 border border-gray-300 bg-white hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors flex items-center justify-center cursor-pointer text-gray-700"
                aria-label="Previous slide"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('impact-carousel');
                  if (el) el.scrollBy({ left: 340, behavior: 'smooth' });
                }}
                className="w-9 h-9 border border-gray-300 bg-white hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors flex items-center justify-center cursor-pointer text-gray-700"
                aria-label="Next slide"
              >
                →
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}