'use client';

import { useScrollReveal } from '../hooks/useScrollReveal';

type Lang = 'id' | 'en';

interface AboutSectionProps {
  lang: Lang;
}

const content = {
  id: {
    label: 'Tentang Kami',
    headline: 'Warma Heritage Group',
    body1: 'Perusahaan induk multi-industri yang berkomitmen membangun bisnis berkelanjutan yang terinspirasi oleh kekayaan warisan Indonesia. Melalui berbagai unit usaha, kami menghadirkan produk, layanan, dan peluang yang menghubungkan potensi lokal dengan pasar global.',
    body2: 'Seluruh perusahaan dalam grup kami dipersatukan oleh nilai Willpower, Adaptability, Responsibility, Mastery, dan Advancement. Prinsip yang membentuk cara kami bertumbuh, berkolaborasi, dan menciptakan nilai jangka panjang.',
    body3: 'Kami percaya bahwa bisnis seharusnya memberikan lebih dari sekadar pertumbuhan ekonomi. Bisnis juga harus memperkuat komunitas, mendukung talenta lokal, dan menciptakan dampak positif yang berkelanjutan bagi generasi mendatang.',
    values: ['Willpower', 'Adaptability', 'Responsibility', 'Mastery', 'Advancement'],
  },
  en: {
    label: 'About Us',
    headline: 'Warma Heritage Group',
    body1: 'A multi-industry holding company committed to building sustainable businesses inspired by Indonesia\'s rich heritage. Through a diverse portfolio of companies, we create products, services, and opportunities that connect local strengths with global markets.',
    body2: 'Our businesses are guided by a shared commitment to Willpower, Adaptability, Responsibility, Mastery, and Advancement. The values that shape how we grow, collaborate, and create long-term value.',
    body3: 'We believe business should create more than economic growth. It should strengthen communities, support local talent, and contribute to a more sustainable future for generations to come.',
    values: ['Willpower', 'Adaptability', 'Responsibility', 'Mastery', 'Advancement'],
  },
};

export default function AboutSection({ lang }: AboutSectionProps) {
  const t = content[lang];
  const { ref: textRef, isVisible: textVisible } = useScrollReveal();
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal();

  return (
    <section id="about" className="w-full bg-white py-24 px-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Teks kiri */}
        <div
          ref={textRef as React.RefObject<HTMLDivElement>}
          className="flex flex-col gap-6"
        >
          <p className={`text-xs tracking-[0.2em] text-gray-400 uppercase reveal ${textVisible ? 'visible' : ''}`}>
            {t.label}
          </p>
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 leading-tight reveal reveal-delay-1 ${textVisible ? 'visible' : ''}`}>
            {t.headline}
          </h2>
          <p className={`text-base text-gray-500 leading-relaxed reveal reveal-delay-2 ${textVisible ? 'visible' : ''}`}>{t.body1}</p>
          <p className={`text-base text-gray-500 leading-relaxed reveal reveal-delay-2 ${textVisible ? 'visible' : ''}`}>{t.body2}</p>
          <p className={`text-base text-gray-500 leading-relaxed reveal reveal-delay-2 ${textVisible ? 'visible' : ''}`}>{t.body3}</p>

          <div className={`flex flex-wrap gap-3 mt-2 reveal reveal-delay-3 ${textVisible ? 'visible' : ''}`}>
            {t.values.map((value) => (
              <span
                key={value}
                className="text-xs tracking-wide border border-gray-300 px-3 py-1 text-gray-600"
              >
                {value}
              </span>
            ))}
          </div>
        </div>

        {/* Foto kanan */}
        <div
          ref={imageRef as React.RefObject<HTMLDivElement>}
          className={`w-full aspect-square bg-gray-100 flex items-center justify-center reveal reveal-delay-1 ${imageVisible ? 'visible' : ''}`}
        >
          <p className="text-gray-400 text-sm">[ Foto Perusahaan ]</p>
        </div>

      </div>
    </section>
  );
}