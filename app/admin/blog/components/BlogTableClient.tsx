'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: number;
  titleId: string;
  slug: string;
  category: string;
  published: boolean;
  createdAt: string;
  coverImage?: string | null;
  readTime?: string | null;
}

export default function BlogTableClient({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchSearch =
        post.titleId.toLowerCase().includes(search.toLowerCase()) ||
        post.slug.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && post.published) ||
        (statusFilter === 'draft' && !post.published);
      const matchCat =
        selectedCategory === 'all' || post.category === selectedCategory;

      return matchSearch && matchStatus && matchCat;
    });
  }, [posts, search, statusFilter, selectedCategory]);

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-[#F5F5F4] p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Semua (<span className="lining-nums">{posts.length}</span>)
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Terbit (<span className="lining-nums">{publishedCount}</span>)
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Draf (<span className="lining-nums">{draftCount}</span>)
          </button>
        </div>

        {/* Search input & Category dropdown */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md ml-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan judul atau slug..."
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg pl-9 pr-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="absolute left-3 top-2.5 text-gray-400"
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Hapus kata kunci pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FAFAFA] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shrink-0 cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Tidak ada artikel yang cocok</p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {search || statusFilter !== 'all' || selectedCategory !== 'all'
                ? 'Coba atur ulang kata kunci pencarian atau filter status Anda.'
                : 'Belum ada artikel di database. Mulai publikasikan narasi baru sekarang.'}
            </p>
            {(search || statusFilter !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setSelectedCategory('all');
                }}
                className="mt-4 text-xs font-medium text-amber-800 hover:underline cursor-pointer"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* table-fixed ensures column widths stay 100% rigid and never jump during inline action */}
            <table className="w-full text-left text-xs border-collapse table-fixed min-w-[760px]">
              <thead>
                <tr className="border-b border-gray-100 bg-[#FAF9F7] text-gray-500 font-semibold tracking-wider uppercase text-[10px]">
                  <th className="py-3.5 px-6 w-[38%]">Artikel & Narasi</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell w-[16%]">Kategori</th>
                  <th className="py-3.5 px-4 hidden md:table-cell w-[12%]">Waktu Baca</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell w-[14%]">Tanggal Terbit</th>
                  <th className="py-3.5 px-4 w-[10%]">Status</th>
                  <th className="py-3.5 px-6 text-right w-[160px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* Title & Cover */}
                    <td className="py-4 px-6 overflow-hidden">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 relative">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.titleId}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-serif">
                              WHG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            title={post.titleId}
                            className="font-medium text-gray-900 group-hover:text-amber-800 transition-colors text-sm line-clamp-1"
                          >
                            {post.titleId}
                          </Link>
                          <p
                            title={`/blog/${post.slug}`}
                            className="text-[11px] text-gray-400 font-mono truncate mt-0.5"
                          >
                            /blog/{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 hidden sm:table-cell overflow-hidden">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium text-[11px] truncate max-w-full">
                        {post.category}
                      </span>
                    </td>

                    {/* Read Time */}
                    <td className="py-4 px-4 text-gray-500 hidden md:table-cell lining-nums">
                      {post.readTime || '3 menit'}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-gray-500 hidden lg:table-cell lining-nums">
                      {new Date(post.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Status with Glowing Pulse Dot */}
                    <td className="py-4 px-4">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Terbit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Draf
                        </span>
                      )}
                    </td>

                    {/* Actions — strictly fixed width cell */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5 w-full">
                        {confirmId === post.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(post.id)}
                              disabled={deletingId === post.id}
                              className="px-2.5 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-all disabled:opacity-50 cursor-pointer"
                              aria-label="Konfirmasi hapus artikel ini"
                            >
                              {deletingId === post.id ? '...' : 'Hapus'}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                              aria-label="Batal hapus artikel"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Preview on public site */}
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all"
                              title="Pratinjau Halaman Publik"
                              aria-label={`Pratinjau artikel ${post.titleId} di website publik`}
                            >
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                                <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                              </svg>
                            </Link>

                            {/* Edit */}
                            <Link
                              href={`/admin/blog/${post.id}/edit`}
                              className="px-2.5 py-1 text-xs font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-100 rounded-md transition-all border border-gray-200/80"
                              aria-label={`Edit artikel ${post.titleId}`}
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => setConfirmId(post.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                              title="Hapus Artikel"
                              aria-label={`Hapus artikel ${post.titleId}`}
                            >
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M2.5 4h11M5.5 4V2.5a1 1 0 011-1h3a1 1 0 011 1V4M6.5 7v5M9.5 7v5M4 4l.8 9.5a1 1 0 001 .5h4.4a1 1 0 001-.5L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
