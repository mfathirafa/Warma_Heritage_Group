'use client';

type Lang = 'id' | 'en';

interface HeroSectionProps {
  lang: Lang;
}

const content = {
  id: {
    headline: 'Membangun Perusahaan yang Sehat, Bersih & Berkelanjutan',
    subheadline: 'Holding company yang membawahi 6 anak perusahaan berbasis warisan budaya Indonesia.',
    cta: 'Hubungi Kami',
  },
  en: {
    headline: 'Building Healthy, Clean & Sustainable Companies',
    subheadline: 'A holding company overseeing 6 subsidiaries rooted in Indonesian cultural heritage.',
    cta: 'Contact Us',
  },
};

export default function HeroSection({ lang }: HeroSectionProps) {
  const t = content[lang];

  const handleContact = () => {
    window.open('https://wa.me/6281239669880', '_blank');
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
            onClick={handleContact}
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