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

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    if (id === 'blog') { router.push('/blog'); return; }
    if (window.location.pathname !== '/') { window.location.href = `/#${id}`; return; }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
        : 'bg-white'
    }`}>
      <div className="max-w-[1440px] mx-auto px-8 h-[80px] flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className="transition-opacity duration-300 hover:opacity-70"
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
              className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-300 tracking-[0.05em] relative group"
            >
              {lang === 'id' ? link.labelId : link.labelEn}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gray-900 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {/* Toggle ID/EN */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLang('id')}
              className={`text-[11px] tracking-[0.1em] px-1.5 py-0.5 transition-all duration-300 ${
                lang === 'id' ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              ID
            </button>
            <span className="text-gray-200 text-xs">/</span>
            <button
              onClick={() => setLang('en')}
              className={`text-[11px] tracking-[0.1em] px-1.5 py-0.5 transition-all duration-300 ${
                lang === 'en' ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label={lang === 'id' ? 'Buka menu navigasi' : 'Open navigation menu'}
            className="md:hidden flex flex-col justify-center gap-[5px] w-6 h-6"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-full h-px bg-gray-900 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-full h-px bg-gray-900 transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-full h-px bg-gray-900 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        menuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'
      }`}>
        <div className="bg-white px-8 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm text-gray-500 hover:text-gray-900 text-left transition-colors duration-300 tracking-wide"
            >
              {lang === 'id' ? link.labelId : link.labelEn}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}