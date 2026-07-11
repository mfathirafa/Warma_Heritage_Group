'use client';

type Lang = 'id' | 'en';

interface CTASectionProps {
  lang: Lang;
}

const content = {
  id: {
    label: 'Kontak',
    headline: 'Tertarik Bermitra dengan Kami?',
    sub: 'Hubungi kami langsung melalui WhatsApp untuk konsultasi lebih lanjut.',
    cta: '💬 Hubungi via WhatsApp',
  },
  en: {
    label: 'Contact',
    headline: 'Interested in Partnering with Us?',
    sub: 'Contact us directly via WhatsApp for further consultation.',
    cta: '💬 Contact via WhatsApp',
  },
};

export default function CTASection({ lang }: CTASectionProps) {
  const t = content[lang];

  return (
    <section
      id="contact"
      className="w-full bg-white py-24 px-8"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-8">
        <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">
          {t.label}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          {t.headline}
        </h2>
        <p className="text-base text-gray-500 max-w-md leading-relaxed">
          {t.sub}
        </p>
        <button
          onClick={() => window.open('https://wa.me/6281239669880', '_blank')}
          className="px-10 py-4 bg-gray-900 text-white text-sm tracking-widest uppercase hover:bg-gray-700 transition-colors duration-300"
        >
          {t.cta}
        </button>

        {/* Info kontak */}
        <div className="flex flex-col md:flex-row gap-6 mt-4 text-sm text-gray-500">
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