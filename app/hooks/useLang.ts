import { useState, useEffect } from 'react';
import { Lang } from '../lib/constants';

export function useLang() {
  const [lang, setLangState] = useState<Lang>('id');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved === 'id' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  return { lang, setLang, isId: lang === 'id' };
}