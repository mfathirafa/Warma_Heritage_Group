'use client';

import { SocialImpact } from '../lib/notion';

type Lang = 'id' | 'en';

interface SocialImpactSectionProps {
  lang: Lang;
  impacts: SocialImpact[];
}

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

  return (
    <section id="impact" className="w-full bg-gray-100 py-24 px-8">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
            {isId ? 'Dampak Sosial' : 'Social Impact'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {isId ? 'Kontribusi Kami untuk Masyarakat' : 'Our Contribution to Society'}
          </h2>
        </div>

        {/* Horizontal scroll container */}
        <div
          className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayImpacts.map((impact) => (
            <div
              key={impact.id}
              className="flex flex-col gap-6 flex-shrink-0 snap-start"
              style={{ width: 'calc(33.333% - 1.5rem)' }}
            >
              {/* Foto */}
              <div className="w-full aspect-square overflow-hidden bg-gray-300">
                {impact.cover ? (
                  <img
                    src={impact.cover}
                    alt={isId ? impact.titleId : impact.titleEn}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 text-xs">[ Foto Kegiatan ]</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-3">
                <span className="text-xs text-gray-400 tracking-widest uppercase">
                  {isId ? impact.categoryId : impact.categoryEn}
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  {isId ? impact.titleId : impact.titleEn}
                </h3>
                <div className="w-8 h-px bg-gray-300" />
                <p className="text-sm text-gray-500 leading-relaxed">
                  {isId ? impact.descId : impact.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Hint scroll — hanya muncul kalau lebih dari 3 item */}
        {displayImpacts.length > 3 && (
          <p className="text-xs text-gray-400 text-right mt-4 tracking-wide">
            {isId ? 'Geser untuk lihat lebih →' : 'Scroll to see more →'}
          </p>
        )}

      </div>
    </section>
  );
}