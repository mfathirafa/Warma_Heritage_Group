'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BlogPost } from '../lib/notion';
import { useLang } from '../hooks/useLang';

type Lang = 'id' | 'en';

interface BlogClientProps {
  posts: BlogPost[];
}

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogClient({ posts }: BlogClientProps) {
  const { lang, setLang, isId } = useLang();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const router = useRouter();

  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];
  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  return (
    <main>
      <Navbar lang={lang} setLang={setLang} />

      {/* Header */}
      <section className="w-full bg-white pt-[80px]">
        <div className="max-w-[1440px] mx-auto px-8 pt-20 pb-16 border-b border-gray-100">
          <p className="text-[11px] tracking-[0.2em] text-gray-400 uppercase mb-5">
            {isId ? 'Blog & Artikel' : 'Blog & Articles'}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h1 className="text-4xl md:text-5xl text-gray-900 leading-tight max-w-lg">
              {isId ? 'Wawasan & Cerita' : 'Insights & Stories'}
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm md:text-right">
              {isId
                ? 'Artikel, wawasan, dan cerita di balik Warma Heritage Group dan anak-anak perusahaannya.'
                : 'Articles, insights, and stories behind Warma Heritage Group and its subsidiaries.'}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full bg-white py-16 px-8">
        <div className="max-w-[1440px] mx-auto">

          {/* Filter */}
          {categories.length > 1 && (
            <div className="flex gap-2 flex-wrap mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] tracking-[0.12em] uppercase px-4 py-2 transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-gray-900 text-white'
                      : 'bg-transparent text-gray-400 hover:text-gray-900 border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {cat === 'all' ? (isId ? 'Semua' : 'All') : cat}
                </button>
              ))}
              <span className="ml-auto text-[11px] text-gray-400 self-center">
                {filteredPosts.length} {isId ? 'artikel' : 'articles'}
              </span>
            </div>
          )}

          {/* Empty state */}
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <img src="/Logo_clear.png" alt="" className="w-12 opacity-10" />
              <p className="text-sm text-gray-400">
                {isId ? 'Belum ada artikel di kategori ini.' : 'No articles in this category yet.'}
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                className="text-[11px] tracking-[0.12em] uppercase text-gray-400 hover:text-gray-900 transition-colors border-b border-gray-300 hover:border-gray-900 pb-0.5"
              >
                {isId ? 'Lihat semua artikel' : 'View all articles'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
              {filteredPosts.map((post) => {
                const title = isId ? post.titleId : post.titleEn;
                const excerpt = isId ? post.excerptId : post.excerptEn;
                const readTime = estimateReadTime((isId ? post.contentId : post.contentEn) || excerpt || '');

                return (
                  <article
                    key={post.id}
                    onClick={() => router.push(`/blog/${post.slug}`)}
                    className="flex flex-col gap-0 group cursor-pointer"
                  >
                    {/* Cover */}
                    <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-5">
                      {post.cover ? (
                        <img
                          src={post.cover}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <img src="/Logo_clear.png" alt="" className="w-16 opacity-10" />
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3">
                      {post.category && (
                        <span className="text-[10px] tracking-[0.15em] text-gray-400 uppercase">
                          {post.category}
                        </span>
                      )}
                      {post.date && (
                        <>
                          <span className="text-gray-200">·</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(post.date).toLocaleDateString(
                              isId ? 'id-ID' : 'en-US',
                              { day: 'numeric', month: 'long', year: 'numeric' }
                            )}
                          </span>
                        </>
                      )}
                      <span className="text-gray-200">·</span>
                      <span className="text-[10px] text-gray-400">
                        {readTime} {isId ? 'mnt' : 'min'}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg text-gray-900 leading-snug mb-3 transition-colors duration-300 group-hover:text-gray-500">
                      {title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-400 leading-relaxed mb-5 line-clamp-2">
                      {excerpt}
                    </p>

                    {/* Read more */}
                    <span className="text-[10px] tracking-[0.15em] uppercase text-gray-400 flex items-center gap-2 transition-all duration-300 group-hover:text-gray-900 group-hover:gap-3 w-fit">
                      {isId ? 'Baca Selengkapnya' : 'Read More'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  );
}