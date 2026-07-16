'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BlogPost } from '../lib/notion';

type Lang = 'id' | 'en';

interface BlogClientProps {
  posts: BlogPost[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  const [lang, setLang] = useState<Lang>('id');
  const [activeCategory, setActiveCategory] = useState<string>('all');
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

  // Ambil kategori unik dari semua post
  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  // Filter post berdasarkan kategori aktif
  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  return (
    <main>
      <Navbar lang={lang} setLang={handleSetLang} />

      {/* Header */}
      <section className="w-full bg-gray-50 pt-[72px] py-24 px-8">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
            {isId ? 'Blog & Artikel' : 'Blog & Articles'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {isId ? 'Wawasan & Cerita' : 'Insights & Stories'}
          </h1>
          <p className="text-base text-gray-500 mt-4 max-w-xl leading-relaxed">
            {isId
              ? 'Kumpulan artikel, wawasan, dan cerita di balik Warma Heritage Group dan anak-anak perusahaannya.'
              : 'A collection of articles, insights, and stories behind Warma Heritage Group and its subsidiaries.'}
          </p>
        </div>
      </section>

      {/* Blog posts */}
      <section className="w-full bg-white py-24 px-8">
        <div className="max-w-[1440px] mx-auto">

          {/* Filter kategori */}
          {categories.length > 1 && (
            <div className="flex gap-3 flex-wrap mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors duration-200 ${
                    activeCategory === cat
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-900 hover:text-gray-900'
                  }`}
                >
                  {cat === 'all' ? (isId ? 'Semua' : 'All') : cat}
                </button>
              ))}
            </div>
          )}

          {/* Post count */}
          <p className="text-xs text-gray-400 mb-8 tracking-wide">
            {filteredPosts.length} {isId ? 'artikel' : 'articles'}
            {activeCategory !== 'all' && ` · ${activeCategory}`}
          </p>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-base">
                {isId ? 'Belum ada artikel di kategori ini.' : 'No articles in this category yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => router.push(`/blog/${post.slug}`)}
                  className="flex flex-col gap-4 group cursor-pointer"
                >
                  {/* Cover image */}
                  <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
                    {post.cover ? (
                      <img
                        src={post.cover}
                        alt={isId ? post.titleId : post.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-400 text-xs">[ Foto Artikel ]</p>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 tracking-widest uppercase">
                      {post.category}
                    </span>
                    {post.date && (
                      <>
                        <span className="text-gray-200 text-xs">|</span>
                        <span className="text-xs text-gray-400">
                          {new Date(post.date).toLocaleDateString(
                            isId ? 'id-ID' : 'en-US',
                            { day: 'numeric', month: 'long', year: 'numeric' }
                          )}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-gray-600 transition-colors">
                    {isId ? post.titleId : post.titleEn}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {isId ? post.excerptId : post.excerptEn}
                  </p>

                  {/* Read more */}
                  <span className="text-xs tracking-widest uppercase text-gray-900 border-b border-gray-900 w-fit pb-0.5 group-hover:text-gray-500 group-hover:border-gray-500 transition-colors">
                    {isId ? 'Baca Selengkapnya →' : 'Read More →'}
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  );
}