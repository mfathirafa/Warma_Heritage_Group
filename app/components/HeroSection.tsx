'use client';

type Lang = 'id' | 'en';

interface HeroSectionProps {
  lang: Lang;
}

const content = {
  id: {
    headline: 'Membangun Bisnis Berkelanjutan Berlandaskan Warisan Indonesia',
    subheadline: 'Warma Heritage Group adalah holding company yang membangun dan mengembangkan berbagai bisnis yang berakar pada budaya, kerajinan, dan semangat kewirausahaan Indonesia. Kami menciptakan nilai yang berkelanjutan bagi masyarakat, komunitas, dan generasi mendatang.',
    cta: 'Jelajahi Perusahaan Kami',
  },
  en: {
    headline: 'Building Sustainable Businesses with Indonesian Heritage',
    subheadline: 'Warma Heritage Group is a holding company that builds and grows businesses rooted in Indonesia\'s culture, craftsmanship, and entrepreneurial spirit. Creating lasting value for people, communities, and future generations.',
    cta: 'Explore Our Companies',
  },
};

export default function HeroSection({ lang }: HeroSectionProps) {
  const t = content[lang];

  const scrollToCompanies = () => {
    const el = document.getElementById('companies');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-gray-50 px-8 pt-[72px]"
    >
      <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center py-24">

        {/* Teks kiri */}
        <div className="flex flex-col gap-6">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">
            Warma Heritage Group
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {t.headline}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-md">
            {t.subheadline}
          </p>
          <button
            onClick={scrollToCompanies}
            className="w-fit mt-2 px-8 py-4 bg-gray-900 text-white text-sm tracking-widest uppercase hover:bg-gray-700 transition-colors duration-300"
          >
            {t.cta}
          </button>
        </div>

        {/* Placeholder gambar kanan */}
        <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
          <p className="text-gray-400 text-sm">[ Hero Image ]</p>
        </div>

      </div>
    </section>
  );
}