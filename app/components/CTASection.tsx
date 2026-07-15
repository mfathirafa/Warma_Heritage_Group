'use client';

import { useScrollReveal } from '../hooks/useScrollReveal';

type Lang = 'id' | 'en';

interface CTASectionProps {
  lang: Lang;
}

const content = {
  id: {
    label: 'Kontak',
    headline: 'Tertarik Bermitra dengan Kami?',
    sub: 'Hubungi kami langsung melalui WhatsApp untuk konsultasi lebih lanjut.',
    cta: 'Hubungi via WhatsApp',
    waMessage: 'Halo%20Warma%20Heritage%20Group%2C%20saya%20tertarik%20untuk%20bermitra%20dengan%20perusahaan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
  },
  en: {
    label: 'Contact',
    headline: 'Interested in Partnering with Us?',
    sub: 'Contact us directly via WhatsApp for further consultation.',
    cta: 'Contact via WhatsApp',
    waMessage: 'Hello%20Warma%20Heritage%20Group%2C%20I%20am%20interested%20in%20partnering%20with%20your%20company.%20Could%20you%20tell%20me%20more%3F',
  },
};

export default function CTASection({ lang }: CTASectionProps) {
  const t = content[lang];
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="contact" className="w-full bg-white py-24 px-8">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-8"
      >
        <p className={`text-xs tracking-[0.2em] text-gray-400 uppercase reveal ${isVisible ? 'visible' : ''}`}>
          {t.label}
        </p>
        <h2 className={`text-3xl md:text-5xl font-bold text-gray-900 max-w-2xl leading-tight reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`}>
          {t.headline}
        </h2>
        <p className={`text-base text-gray-500 max-w-md leading-relaxed reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}>
          {t.sub}
        </p>
        
        {/* Tag <a> yang hilang sudah ditambahkan di bawah ini */}
        <a
          href={`https://wa.me/6281239669880?text=${t.waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-10 py-4 bg-gray-900 text-white text-sm tracking-widest uppercase hover:bg-gray-700 transition-colors duration-300 reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}
        >
          {t.cta}
        </a>

        <div className={`flex flex-col md:flex-row gap-6 mt-4 text-sm text-gray-500 reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}>
          <span>WarmaGroup@gmail.com</span>
          <span className="hidden md:block text-gray-300">|</span>
          <span>+62 812-3966-9880</span>
          <span className="hidden md:block text-gray-300">|</span>
          <span>Jl. Tukad Yeh Aya IX No. 90, Denpasar, Bali</span>
        </div>
      </div>
    </section>
  );
}