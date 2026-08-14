'use client';

import { useScrollReveal } from '../hooks/useScrollReveal';
import ContactForm from './ContactForm';

type Lang = 'id' | 'en';

interface CTASectionProps {
  lang: Lang;
}

const content = {
  id: {
    label: 'Kontak',
    headline: 'Tertarik Berkolaborasi dengan Kami?',
    sub: 'Hubungi kami langsung melalui WhatsApp untuk konsultasi lebih lanjut.',
    cta: 'Hubungi via WhatsApp',
    waMessage: 'Halo%20Warma%20Heritage%20Group%2C%20saya%20tertarik%20untuk%20bermitra%20dengan%20perusahaan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
  },
  en: {
    label: 'Contact',
    headline: 'Interested in Collaborating with Us?',
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
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Kiri: Info */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col gap-8 justify-center"
        >
          <div className="flex flex-col gap-4">
            <p className={`text-xs tracking-[0.2em] text-gray-400 uppercase reveal ${isVisible ? 'visible' : ''}`}>
              {t.label}
            </p>
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 leading-tight reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`}>
              {t.headline}
            </h2>
            <p className={`text-base text-gray-500 leading-relaxed reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}>
              {t.sub}
            </p>
          </div>

          <a
            href={`https://wa.me/6281239669880?text=${t.waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-fit flex items-center gap-3 px-8 py-4 border border-gray-900 text-gray-900 text-sm tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-colors duration-300 reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t.cta}
          </a>

          <div className={`flex flex-col gap-3 text-sm text-gray-500 reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}>
            <span>warmaheritagegroup@gmail.com</span>
            <span>+62 812-3966-9880</span>
            <span>Jalan Sekar Tunjung XV No. 1A, Denpasar, Bali</span>
          </div>
        </div>

        {/* Kanan: Form */}
        <div className="flex flex-col gap-6">
          <ContactForm lang={lang} />
        </div>

      </div>
    </section>
  );
}
