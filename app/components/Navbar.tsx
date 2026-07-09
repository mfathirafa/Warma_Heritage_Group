'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const navLinks = [
  { id: 'about', labelId: 'Tentang Kami', labelEn: 'About Us' },
  { id: 'founder', labelId: 'Pendiri', labelEn: 'Founder' },
  { id: 'companies', labelId: 'Perusahaan', labelEn: 'Companies' },
  { id: 'services', labelId: 'Layanan', labelEn: 'Services' },
  { id: 'impact', labelId: 'Dampak Sosial', labelEn: 'Social Impact' },
  { id: 'contact', labelId: 'Kontak', labelEn: 'Contact' },
  { id: 'blog', labelId: 'Blog', labelEn: 'Blog'},
];

interface NavbarProps {
  lang: 'id' | 'en';
  setLang: (lang: 'id' | 'en') => void;
}

export default function Navbar({ lang, setLang }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect scroll untuk shadow navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll ke section
  const scrollToSection = (id: string) => {
    if (id === 'blog') {
      window.location.href = '/blog';
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-[72px] flex items-center justify-between">
        
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Image
            src="/Logo_clear.png"
            alt="Warma Heritage Group"
            width={140}
            height={40}
            className="object-contain"
            priority
          />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm text-gray-600 hover:text-black transition-colors duration-200 tracking-wide"
            >
              {lang === 'id' ? link.labelId : link.labelEn}
            </button>
          ))}
        </div>

        {/* Language Toggle + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Toggle ID/EN */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-sm px-2 py-1">
            <button
              onClick={() => setLang('id')}
              className={`text-xs font-medium px-1 transition-colors ${
                lang === 'id' ? 'text-black' : 'text-gray-400'
              }`}
            >
              ID
            </button>
            <span className="text-gray-300 text-xs">|</span>
            <button
              onClick={() => setLang('en')}
              className={`text-xs font-medium px-1 transition-colors ${
                lang === 'en' ? 'text-black' : 'text-gray-400'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-5 h-0.5 bg-black transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-black transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-black transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-8 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm text-gray-600 hover:text-black text-left transition-colors"
            >
              {lang === 'id' ? link.labelId : link.labelEn}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}