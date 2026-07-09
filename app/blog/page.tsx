'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Lang = 'id' | 'en';

const posts = [
  {
    id: 1,
    date: '2026-07-01',
    categoryId: 'Keberlanjutan',
    categoryEn: 'Sustainability',
    titleId: 'Membangun Bisnis Berkelanjutan Berbasis Warisan Budaya',
    titleEn: 'Building Sustainable Business Rooted in Cultural Heritage',
    excerptId: 'Bagaimana Warma Heritage Group mengintegrasikan nilai-nilai budaya lokal ke dalam model bisnis modern yang berkelanjutan.',
    excerptEn: 'How Warma Heritage Group integrates local cultural values into a modern sustainable business model.',
  },
  {
    id: 2,
    date: '2026-07-05',
    categoryId: 'Warisan Budaya',
    categoryEn: 'Cultural Heritage',
    titleId: 'Rotan Indonesia: Potensi Ekspor yang Belum Dimaksimalkan',
    titleEn: 'Indonesian Rattan: Untapped Export Potential',
    excerptId: 'Industri rotan Indonesia memiliki potensi besar di pasar global. Karya Rotan Indonesia hadir untuk menjawab tantangan ini.',
    excerptEn: 'The Indonesian rattan industry has immense potential in the global market. Karya Rotan Indonesia is here to answer this challenge.',
  },
  {
    id: 3,
    date: '2026-07-08',
    categoryId: 'Dampak Sosial',
    categoryEn: 'Social Impact',
    titleId: 'Pelestarian Tari Bali di Era Modern',
    titleEn: 'Preserving Balinese Dance in the Modern Era',
    excerptId: 'Bali Menari berkomitmen menjaga kelestarian seni tari tradisional Bali sekaligus membuka akses lebih luas ke panggung internasional.',
    excerptEn: 'Bali Menari is committed to preserving traditional Balinese dance while opening broader access to international stages.',
  },
];

export default function BlogPage() {
  const [lang, setLang] = useState<Lang>('id');
  const isId = lang === 'id';

  return (
    <main>
      <Navbar lang={lang} setLang={setLang} />

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

      {/* Blog posts grid */}
      <section className="w-full bg-white py-24 px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-4 group cursor-pointer"
            >
              {/* Placeholder thumbnail */}
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400 text-xs">[ Foto Artikel ]</p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 tracking-widest uppercase">
                  {isId ? post.categoryId : post.categoryEn}
                </span>
                <span className="text-gray-200 text-xs">|</span>
                <span className="text-xs text-gray-400">
                  {new Date(post.date).toLocaleDateString(
                    isId ? 'id-ID' : 'en-US',
                    { day: 'numeric', month: 'long', year: 'numeric' }
                  )}
                </span>
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
      </section>

      <Footer lang={lang} />
    </main>
  );
}