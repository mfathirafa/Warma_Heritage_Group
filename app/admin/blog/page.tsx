import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';
import BlogTableClient from './components/BlogTableClient';

export const metadata: Metadata = { title: 'Manajemen Blog' };

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      titleId: true,
      slug: true,
      category: true,
      published: true,
      createdAt: true,
      coverImage: true,
      readTime: true,
    },
  });

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div className="space-y-6">
      {/* Header section with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Manajemen Konten
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-tight">
            Blog & Narasi Holding
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Kelola publikasi artikel, wawasan industri kerajinan, dan narasi pelestarian budaya.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-[#141414] hover:bg-black text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Tulis Artikel Baru</span>
          </Link>
        </div>
      </div>

      {/* Interactive Table with Search, Filter & Actions */}
      <BlogTableClient
        posts={posts.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
