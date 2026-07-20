'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { BlogPost } from '../../lib/notion';

type Lang = 'id' | 'en';

interface BlogDetailClientProps {
  post: BlogPost;
}

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const [lang, setLang] = useState<Lang>('id');
  const [readProgress, setReadProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const isId = lang === 'id';

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved) setLang(saved);
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const progress = Math.min(100, Math.max(0, (-top / (height - window.innerHeight)) * 100));
      setReadProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const title = isId ? post.titleId : post.titleEn;
  const excerpt = isId ? post.excerptId : post.excerptEn;
  const content = isId ? post.contentId : post.contentEn;
  const readTime = estimateReadTime(content || excerpt || '');

  const paragraphs = content ? content.split('\n').filter(p => p.trim()) : [];

  return (
    <main>
      <Navbar lang={lang} setLang={handleSetLang} />

      {/* Reading Progress */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[60] bg-transparent">
        <div
          className="h-full bg-gray-900 transition-all duration-75"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Hero */}
      <section className="w-full bg-white pt-[80px]">
        <div className="max-w-[680px] mx-auto px-8 pt-16 pb-12">

          {/* Back */}
          <button
            onClick={() => router.push('/blog')}
            className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-gray-400 hover:text-gray-900 transition-all duration-300 mb-12 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-x-1">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            {isId ? 'Blog' : 'Blog'}
          </button>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {post.category && (
              <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 border border-gray-200 px-2.5 py-1">
                {post.category}
              </span>
            )}
            {post.date && (
              <span className="text-[11px] text-gray-400">
                {new Date(post.date).toLocaleDateString(
                  isId ? 'id-ID' : 'en-US',
                  { day: 'numeric', month: 'long', year: 'numeric' }
                )}
              </span>
            )}
            <span className="text-gray-200">·</span>
            <span className="text-[11px] text-gray-400">
              {readTime} {isId ? 'menit baca' : 'min read'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl text-gray-900 leading-[1.2] mb-8 tracking-[-0.01em]">
            {title}
          </h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-base md:text-lg text-gray-500 leading-relaxed pl-4 border-l border-gray-200">
              {excerpt}
            </p>
          )}

          {/* Author */}
          <div className="flex items-center gap-3 mt-10 pt-8 border-t border-gray-100">
            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p className="text-[12px] text-gray-700 font-medium tracking-wide">Warma Heritage Group</p>
              <p className="text-[10px] text-gray-400 tracking-[0.05em] mt-0.5">
                {isId ? 'Tim Editorial' : 'Editorial Team'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Cover Image */}
      {post.cover && (
        <div className="w-full h-[45vh] md:h-[60vh] relative bg-gray-100 overflow-hidden">
          <Image
            src={post.cover}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            onError={(e) => {
              e.currentTarget.parentElement!.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Article Content */}
      <section ref={articleRef} className="w-full bg-white py-16 px-8">
        <div className="max-w-[680px] mx-auto">

          {paragraphs.length > 0 ? (
            <div className="flex flex-col gap-0">
              {paragraphs.map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-xl md:text-2xl text-gray-900 mt-12 mb-4 leading-snug">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('# ')) {
                  return (
                    <h2 key={index} className="text-2xl md:text-3xl text-gray-900 mt-14 mb-5 leading-snug">
                      {paragraph.replace('# ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('> ')) {
                  return (
                    <blockquote key={index} className="border-l border-gray-200 pl-5 my-8">
                      <p className="text-base md:text-lg text-gray-500 leading-relaxed italic">
                        {paragraph.replace('> ', '')}
                      </p>
                    </blockquote>
                  );
                }
                return (
                  <p key={index} className="text-base md:text-[17px] text-gray-600 leading-[1.85] mb-6">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center gap-4">
              <img src="/Logo_clear.png" alt="" className="w-10 opacity-10" />
              <p className="text-sm text-gray-400">
                {isId ? 'Konten tidak tersedia.' : 'Content not available.'}
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="my-16 flex items-center gap-6">
            <div className="flex-1 h-px bg-gray-100" />
            <img src="/Logo_clear.png" alt="" className="w-6 opacity-15" />
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Share */}
          <div className="flex flex-col gap-5 mb-12">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">
              {isId ? 'Bagikan' : 'Share'}
            </p>
            <div className="flex gap-2 flex-wrap">
              
              <a
                href={`https://wa.me/?text=${encodeURIComponent(title + '\n' + currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase border border-gray-200 px-4 py-2.5 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase border border-gray-200 px-4 py-2.5 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all duration-300"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {isId ? 'Disalin!' : 'Copied!'}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    {isId ? 'Salin Link' : 'Copy Link'}
                  </>
                )}
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase border border-gray-200 px-4 py-2.5 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
              </a>
            </div>
          </div>

          {/* Back */}
          <div className="pt-8 border-t border-gray-100">
            <button
              onClick={() => router.push('/blog')}
              className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-gray-400 hover:text-gray-900 transition-all duration-300 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-x-1">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              {isId ? 'Kembali ke Blog' : 'Back to Blog'}
            </button>
          </div>

        </div>
      </section>

      <Footer lang={lang} />
    </main>
  );
}