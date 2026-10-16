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
    sub: 'Hubungi kami langsung melalui WhatsApp untuk konsultasi kemitraan, pemesanan, atau eksplorasi bisnis holding.',
    cta: 'Hubungi via WhatsApp',
    waMessage: 'Halo%20Warma%20Heritage%20Group%2C%20saya%20tertarik%20untuk%20bermitra%20dengan%20perusahaan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
  },
  en: {
    label: 'Contact',
    headline: 'Interested in Collaborating with Us?',
    sub: 'Contact us directly via WhatsApp for partnership consultations, inquiries, or exploring our holding portfolio.',
    cta: 'Contact via WhatsApp',
    waMessage: 'Hello%20Warma%20Heritage%20Group%2C%20I%20am%20interested%20in%20partnering%20with%20your%20company.%20Could%20you%20tell%20me%20more%3F',
  },
};

export default function CTASection({ lang }: CTASectionProps) {
  const t = content[lang];
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="contact" className="w-full bg-white py-20 sm:py-24 px-6 sm:px-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        {/* Kiri: Info */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col gap-8 justify-center"
        >
          <div className="flex flex-col gap-4">
            <p className={`text-xs tracking-[0.2em] text-gray-500 uppercase reveal ${isVisible ? 'visible' : ''}`}>
              {t.label}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-serif font-bold text-gray-900 leading-tight reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`}>
              {t.headline}
            </h2>
            <p className={`text-base text-gray-600 leading-relaxed reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}>
              {t.sub}
            </p>
          </div>

          <a
            href={`https://wa.me/6281239669880?text=${t.waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-fit flex items-center justify-center gap-3 px-8 py-4 bg-gray-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-black transition-all duration-300 text-center shadow-xs cursor-pointer rounded-xs reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>{t.cta}</span>
          </a>

          <div className={`flex flex-col gap-3.5 text-sm text-gray-600 reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}>
            <a
              href="mailto:warmaheritagegroup@gmail.com"
              className="hover:text-black transition-colors flex items-center gap-2.5 font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>warmaheritagegroup@gmail.com</span>
            </a>

            <a
              href="tel:+6281239669880"
              className="hover:text-black transition-colors flex items-center gap-2.5 font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+62 812-3966-9880</span>
            </a>

            <a
              href="https://maps.google.com/?q=Jalan+Sekar+Tunjung+XV+No.+1A,+Denpasar,+Bali"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors flex items-start gap-2.5 font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Jalan Sekar Tunjung XV No. 1A, Denpasar, Bali 80237 (Buka di Google Maps ↗)</span>
            </a>

            <div className="flex items-center gap-2.5 text-xs text-gray-500 pt-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{lang === 'id' ? 'Senin – Jumat: 09:00 – 17:00 WITA' : 'Monday – Friday: 09:00 – 17:00 WITA'}</span>
            </div>
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
