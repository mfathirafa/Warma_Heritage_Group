'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';

type Lang = 'id' | 'en';

export default function Home() {
  const [lang, setLang] = useState<Lang>('id');

  return (
    <main>
      <Navbar lang={lang} setLang={setLang} />
      <HeroSection lang={lang} />
      <AboutSection lang={lang} />
    </main>
  );
}