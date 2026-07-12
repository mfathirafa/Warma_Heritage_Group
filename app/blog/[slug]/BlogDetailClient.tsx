'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { BlogPost } from '../../lib/notion';

type Lang = 'id' | 'en';

interface BlogDetailClientProps {
  post: BlogPost;
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const [lang, setLang] = useState<Lang>('id');
  const router = useRouter();
  const isId = lang === 'id';

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved) setLang(saved);
  }, []);

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

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
            {isId ? post.titleId : post.titleEn}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-500 leading-relaxed border-l-2 border-gray-300 pl-4">
            {isId ? post.excerptId : post.excerptEn}
          </p>
        </div>
      </section>

      {/* Cover image */}
      {post.cover && (
        <div className="w-full max-h-[500px] overflow-hidden">
          <img
            src={post.cover}
            alt={isId ? post.titleId : post.titleEn}
            className="w-full object-cover"
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

          {/* Back button */}
          <div className="mt-16 pt-8 border-t border-gray-200">
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