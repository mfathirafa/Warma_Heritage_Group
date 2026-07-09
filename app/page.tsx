'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FounderSection from './components/FounderSection';
import CompaniesSection from './components/CompaniesSection';
import ServicesSection from './components/ServicesSection';
import SocialImpactSection from './components/SocialImpactSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

type Lang = 'id' | 'en';

export default function Home() {
  const [lang, setLang] = useState<Lang>('id');

  return (
    <main>
      <Navbar lang={lang} setLang={setLang} />
      <HeroSection lang={lang} />
      <AboutSection lang={lang} />
      <FounderSection lang={lang} />
      <CompaniesSection lang={lang} />
      <ServicesSection lang={lang} />
      <SocialImpactSection lang={lang} />
      <CTASection lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}