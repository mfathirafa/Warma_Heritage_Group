'use client';

import Image from 'next/image';

type Lang = 'id' | 'en';

interface AboutSectionProps {
  lang: Lang;
}

const content = {
  id: {
    label: 'Tentang Kami',
    headline: 'Warma Heritage Group',
    body: 'Warma Heritage Group adalah perusahaan induk yang berfokus pada penciptaan ekosistem bisnis yang sehat, bersih, dan berkelanjutan. Dengan pendekatan berbasis warisan budaya Indonesia, kami membangun perusahaan yang tidak hanya menguntungkan secara ekonomi, tetapi juga memberikan dampak positif bagi masyarakat dan lingkungan.',
    values: ['Sustainability', 'Heritage', 'Integrity'],
  },
  en: {
    label: 'About Us',
    headline: 'Warma Heritage Group',
    body: 'Warma Heritage Group is a holding company focused on creating a healthy, clean, and sustainable business ecosystem. Rooted in Indonesian cultural heritage, we build companies that are not only economically profitable but also create positive impact for society and the environment.',
    values: ['Sustainability', 'Heritage', 'Integrity'],
  },
};

export default function AboutSection({ lang }: AboutSectionProps) {
  const t = content[lang];

  return (
    <section
      id="about"
      className="w-full bg-white py-24 px-8"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Teks kiri */}
        <div className="flex flex-col gap-6">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">
            {t.label}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {t.headline}
          </h2>
          <p className="text-base text-gray-500 leading-relaxed">
            {t.body}
          </p>

          {/* Values */}
          <div className="flex gap-6 mt-2">
            {t.values.map((value) => (
              <div key={value} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-900 rounded-full" />
                <span className="text-sm text-gray-700 tracking-wide">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Foto kanan — persegi */}
        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400 text-sm">[ Foto Perusahaan ]</p>
        </div>

      </div>
    </section>
  );
}