'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { NAV_LINKS, Lang } from '../lib/constants';

interface NavbarProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export default function Navbar({ lang, setLang }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    if (id === 'blog') { router.push('/blog'); return; }
    if (window.location.pathname !== '/') { window.location.href = `/#${id}`; return; }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/98 backdrop-blur-md border-b border-gray-200/80 shadow-xs'
        : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 h-[80px] flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className="transition-opacity duration-300 hover:opacity-75 cursor-pointer py-2"
          aria-label="Warma Heritage Group - Beranda"
        >
          <Image
            src="/Logo_clear.png"
            alt="Warma Heritage Group"
            width={130}
            height={36}
            className="object-contain"
            priority
          />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-[13px] font-medium text-gray-600 hover:text-gray-950 transition-colors duration-300 tracking-[0.05em] relative group cursor-pointer"
            >
              {lang === 'id' ? link.labelId : link.labelEn}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-gray-900 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Toggle ID/EN: Accessible pill with minimum 44px touch ergonomics */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-full border border-gray-200">
            <button
              onClick={() => setLang('id')}
              className={`min-w-[38px] h-8 text-[11px] font-semibold tracking-wider rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                lang === 'id'
                  ? 'bg-gray-950 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              aria-label="Pilih Bahasa Indonesia"
            >
              ID
            </button>
            <button
              onClick={() => setLang('en')}
              className={`min-w-[38px] h-8 text-[11px] font-semibold tracking-wider rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                lang === 'en'
                  ? 'bg-gray-950 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              aria-label="Select English language"
            >
              EN
            </button>
          </div>

          {/* Mobile hamburger with 44px tap target */}
          <button
            aria-label={lang === 'id' ? 'Buka menu navigasi' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-11 h-11 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-6 h-[2px] bg-gray-900 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-[2px] bg-gray-900 transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-6 h-[2px] bg-gray-900 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        menuOpen ? 'max-h-[500px] border-t border-gray-200 shadow-xl' : 'max-h-0'
      }`}>
        <div className="bg-white px-6 py-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-base font-medium text-gray-800 hover:text-black py-3.5 border-b border-gray-100 text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>{lang === 'id' ? link.labelId : link.labelEn}</span>
              <span className="text-gray-400 text-sm">→</span>
            </button>
          ))}

          {/* Quick CTA button in mobile drawer */}
          <div className="pt-4 mt-2">
            <a
              href="https://wa.me/6281239669880"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="w-full py-3.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 shadow-xs"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>{lang === 'id' ? 'Konsultasi WhatsApp' : 'WhatsApp Inquiry'}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}