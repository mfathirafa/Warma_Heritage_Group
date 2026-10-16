'use client';

import Image from 'next/image';
import { useScrollReveal } from '../hooks/useScrollReveal';

type Lang = 'id' | 'en';

interface AboutSectionProps {
  lang: Lang;
}

const warmaValues = {
  id: [
    { letter: 'W', title: 'Willpower', desc: 'Keteguhan tekad membangun fondasi bisnis yang kokoh, berdaya tahan tinggi, dan berkelanjutan.' },
    { letter: 'A', title: 'Adaptability', desc: 'Ketangkasan berinovasi dan merespons pasar global dengan tetap menjunjung kearifan lokal.' },
    { letter: 'R', title: 'Responsibility', desc: 'Komitmen etis penuh terhadap kesejahteraan pengrajin, lingkungan, dan komunitas.' },
    { letter: 'M', title: 'Mastery', desc: 'Dedikasi tanpa kompromi pada keunggulan keahlian tangan dan standar kualitas tertinggi.' },
    { letter: 'A', title: 'Advancement', desc: 'Mendorong kemajuan bersama yang inklusif dan membuka peluang bagi generasi penerus.' },
  ],
  en: [
    { letter: 'W', title: 'Willpower', desc: 'Unyielding resolve to build robust, resilient, and enduring business foundations.' },
    { letter: 'A', title: 'Adaptability', desc: 'Agility to embrace evolving global markets while preserving authentic cultural heritage.' },
    { letter: 'R', title: 'Responsibility', desc: 'Deep ethical accountability toward artisan livelihoods, ecosystems, and communities.' },
    { letter: 'M', title: 'Mastery', desc: 'Uncompromising dedication to master craftsmanship and export-grade quality standards.' },
    { letter: 'A', title: 'Advancement', desc: 'Fostering shared, sustainable prosperity and pathways for future generations.' },
  ],
};

const content = {
  id: {
    label: 'Tentang Kami',
    headline: 'Warma Heritage Group',
    body1: 'Perusahaan induk multi-industri yang berkomitmen membangun bisnis berkelanjutan yang terinspirasi oleh kekayaan warisan Indonesia. Melalui berbagai unit usaha, kami menghadirkan produk, layanan, dan peluang yang menghubungkan potensi lokal dengan pasar global.',
    body2: 'Seluruh perusahaan dalam grup kami dipersatukan oleh nilai Willpower, Adaptability, Responsibility, Mastery, dan Advancement. Prinsip yang membentuk cara kami bertumbuh, berkolaborasi, dan menciptakan nilai jangka panjang.',
    body3: 'Kami percaya bahwa bisnis seharusnya memberikan lebih dari sekadar pertumbuhan ekonomi. Bisnis juga harus memperkuat komunitas, mendukung talenta lokal, dan menciptakan dampak positif yang berkelanjutan bagi generasi mendatang.',
    valuesHeading: 'Nilai Inti (W-A-R-M-A)',
  },
  en: {
    label: 'About Us',
    headline: 'Warma Heritage Group',
    body1: 'A multi-industry holding company committed to building sustainable businesses inspired by Indonesia\'s rich heritage. Through a diverse portfolio of companies, we create products, services, and opportunities that connect local strengths with global markets.',
    body2: 'Our businesses are guided by a shared commitment to Willpower, Adaptability, Responsibility, Mastery, and Advancement. The values that shape how we grow, collaborate, and create long-term value.',
    body3: 'We believe business should create more than economic growth. It should strengthen communities, support local talent, and contribute to a more sustainable future for generations to come.',
    valuesHeading: 'Core Values (W-A-R-M-A)',
  },
};

export default function AboutSection({ lang }: AboutSectionProps) {
  const t = content[lang];
  const values = warmaValues[lang];
  const { ref: textRef, isVisible: textVisible } = useScrollReveal();
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal();
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollReveal();

  return (
    <section id="about" className="w-full bg-white py-20 sm:py-24 px-6 sm:px-8">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16 sm:gap-20">

        {/* Top: Text & Brand Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* Teks kiri */}
          <div
            ref={textRef as React.RefObject<HTMLDivElement>}
            className="flex flex-col gap-5 sm:gap-6"
          >
            <p className={`text-xs tracking-[0.2em] text-gray-500 uppercase reveal ${textVisible ? 'visible' : ''}`}>
              {t.label}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-serif font-bold text-gray-900 leading-tight reveal reveal-delay-1 ${textVisible ? 'visible' : ''}`}>
              {t.headline}
            </h2>
            <p className={`text-base text-gray-600 leading-relaxed reveal reveal-delay-2 ${textVisible ? 'visible' : ''}`}>{t.body1}</p>
            <p className={`text-base text-gray-600 leading-relaxed reveal reveal-delay-2 ${textVisible ? 'visible' : ''}`}>{t.body2}</p>
            <p className={`text-base text-gray-600 leading-relaxed reveal reveal-delay-2 ${textVisible ? 'visible' : ''}`}>{t.body3}</p>
          </div>

          {/* Foto kanan */}
          <div
            ref={imageRef as React.RefObject<HTMLDivElement>}
            className={`w-full aspect-[4/3] sm:aspect-square bg-gray-100 relative overflow-hidden shadow-xs reveal reveal-delay-1 ${imageVisible ? 'visible' : ''}`}
          >
            <Image
              src="/images/about.jpg"
              alt="Warma Heritage Group"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Bottom: WARMA Acronym Storytelling Cards */}
        <div
          ref={valuesRef as React.RefObject<HTMLDivElement>}
          className={`flex flex-col gap-6 pt-6 border-t border-gray-100 reveal ${valuesVisible ? 'visible' : ''}`}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.2em]">
              Filosofi Dasar
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-gray-900">
              {t.valuesHeading}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {values.map((v, i) => (
              <div
                key={v.letter + i}
                className="bg-gray-50/70 border border-gray-200/80 p-5 flex flex-col gap-2 rounded-xs hover:border-gray-900 hover:bg-white transition-all duration-300 group"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 group-hover:text-amber-800 transition-colors">
                    {v.letter}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    {v.title}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}