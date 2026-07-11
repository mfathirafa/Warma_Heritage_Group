'use client';

type Lang = 'id' | 'en';

interface SocialImpactSectionProps {
  lang: Lang;
}

const impacts = [
  {
    id: 'pengrajin',
    titleId: 'Pemberdayaan Pengrajin Lokal',
    titleEn: 'Local Artisan Empowerment',
    descId: 'Mendukung dan memberdayakan pengrajin lokal untuk menghasilkan produk berkualitas tinggi yang berdaya saing global.',
    descEn: 'Supporting and empowering local artisans to produce high-quality products with global competitiveness.',
  },
  {
    id: 'seni-budaya',
    titleId: 'Pelestarian Seni Budaya Bali',
    titleEn: 'Preservation of Balinese Arts',
    descId: 'Menjaga kelestarian seni dan budaya Bali melalui program edukasi, pertunjukan, dan kolaborasi komunitas.',
    descEn: 'Preserving Balinese arts and culture through education programs, performances, and community collaborations.',
  },
  {
    id: 'lingkungan',
    titleId: 'Program Lingkungan Berkelanjutan',
    titleEn: 'Sustainable Environment Program',
    descId: 'Menjalankan program-program nyata untuk menjaga kelestarian lingkungan dan ekosistem alam Indonesia.',
    descEn: 'Running concrete programs to preserve Indonesia\'s natural environment and ecosystem.',
  },
];

export default function SocialImpactSection({ lang }: SocialImpactSectionProps) {
  const isId = lang === 'id';

  return (
    <section
      id="impact"
      className="w-full bg-gray-100 py-24 px-8"
    >
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

        {/* 3 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impacts.map((impact, index) => (
            <div
              key={impact.id}
              className="flex flex-col gap-6"
            >
              {/* Placeholder foto */}
              <div className="w-full aspect-square bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500 text-xs">[ Foto Kegiatan ]</p>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-3">
                <span className="text-xs text-gray-400 tracking-widest">
                  0{index + 1}
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

      </div>
    </section>
  );
}