'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { BlogPost } from '../../lib/notion';
import Image from 'next/image';

type Lang = 'id' | 'en';

interface BlogDetailClientProps {
  post: BlogPost;
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const [lang, setLang] = useState<Lang>('id');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const router = useRouter();
  const isId = lang === 'id';

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved) setLang(saved);
    
    // Simpan URL window di client-side untuk menghindari error SSR/Hydration
    setCurrentUrl(window.location.href);
  }, []);

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const title = isId ? post.titleId : post.titleEn;

  return (
    <main>
      <Navbar lang={lang} setLang={handleSetLang} />

      {/* Hero */}
      <section className="w-full bg-gray-50 pt-[72px] py-16 px-8">
        <div className="max-w-[800px] mx-auto">
          <button
            onClick={() => router.push('/blog')}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 flex items-center gap-2"
          >
            ← {isId ? 'Kembali ke Blog' : 'Back to Blog'}
          </button>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs text-gray-400 tracking-widest uppercase">
              {post.category}
            </span>
            {post.date && (
              <>
                <span className="text-gray-300 text-xs">|</span>
                <span className="text-xs text-gray-400">
                  {new Date(post.date).toLocaleDateString(
                    isId ? 'id-ID' : 'en-US',
                    { day: 'numeric', month: 'long', year: 'numeric' }
                  )}
                </span>
              </>
            )}
          </div>

          {/* Judul */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-500 leading-relaxed border-l-2 border-gray-300 pl-4">
            {isId ? post.excerptId : post.excerptEn}
          </p>
        </div>
      </section>

      {/* Cover image */}
      {post.cover && (
        <div className="relative w-full h-[300px] md:h-[500px] bg-gray-100 overflow-hidden">
          {/* PERBAIKAN: Menghapus conflict marker & menyatukan properti Next.js Image yang valid */}
          <Image
            src={post.cover}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
            priority // Menambahkan priority karena ini gambar utama di atas folder (above the fold)
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Konten */}
      <section className="w-full bg-white py-16 px-8">
        <div className="max-w-[800px] mx-auto">
          {(isId ? post.contentId : post.contentEn) ? (
            <div className="prose prose-gray max-w-none">
              {(isId ? post.contentId : post.contentEn)
                .split('\n')
                .map((paragraph, index) => (
                  paragraph.trim() ? (
                    <p key={index} className="text-base text-gray-600 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ) : (
                    <br key={index} />
                  )
                ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              {isId ? 'Konten tidak tersedia.' : 'Content not available.'}
            </p>
          )}
          
          {/* Share buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col gap-4">
            <p className="text-xs tracking-widest uppercase text-gray-400">
              {isId ? 'Bagikan Artikel' : 'Share Article'}
            </p>
            <div className="flex gap-3 flex-wrap">
              {/* Share via WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(title + ' - ' + currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs tracking-widest uppercase border border-gray-300 px-4 py-2 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>

              {/* Copy link */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentUrl);
                  alert(isId ? 'Link berhasil disalin!' : 'Link copied!');
                }}
                className="flex items-center gap-2 text-xs tracking-widest uppercase border border-gray-300 px-4 py-2 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                {isId ? 'Salin Link' : 'Copy Link'}
              </button>

              {/* Share Twitter/X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs tracking-widest uppercase border border-gray-300 px-4 py-2 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter / X
              </a>
            </div>
          </div>

          {/* Back button */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => router.push('/blog')}
              className="text-sm tracking-widest uppercase border border-gray-900 px-6 py-3 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
            >
              ← {isId ? 'Kembali ke Blog' : 'Back to Blog'}
            </button>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  );
}