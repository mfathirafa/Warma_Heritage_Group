'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SocialImpact {
  id: number;
  titleId: string;
  categoryId: string | null;
  descId?: string | null;
  order: number;
  published: boolean;
  coverImage?: string | null;
  createdAt: string;
}

export default function SocialImpactTableClient({ items }: { items: SocialImpact[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.titleId.toLowerCase().includes(search.toLowerCase()) ||
        (item.categoryId && item.categoryId.toLowerCase().includes(search.toLowerCase()));
      return matchSearch;
    });
  }, [items, search]);

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/social-impact/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search & View Switcher Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari program atau kategori sosial..."
            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg pl-9 pr-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
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
              className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Switcher: Grid vs Table */}
        <div className="flex items-center gap-1 bg-[#F5F5F4] p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            title="Tampilan Kartu Visual"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            <span className="hidden sm:inline">Kartu</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            title="Tampilan Tabel"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Tabel</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200/80 p-16 text-center">
          <p className="text-sm font-medium text-gray-900">Tidak ada program sosial yang ditemukan</p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? 'Coba ganti kata kunci pencarian.' : 'Belum ada data program sosial di sistem.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Visual Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200/80 shadow-xs hover:border-gray-300 hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Cover Photo */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden border-b border-gray-100">
                {item.coverImage ? (
                  <Image
                    src={item.coverImage}
                    alt={item.titleId}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={item.coverImage.startsWith('http')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 font-serif">
                    CSR Program
                  </div>
                )}

                {/* Priority order badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                  Urutan #{item.order}
                </div>

                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  {item.published ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-gray-800 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    {item.categoryId || 'Inisiatif Sosial'}
                  </span>
                  <h3 className="text-base font-serif font-medium text-gray-900 mt-2 line-clamp-2">
                    {item.titleId}
                  </h3>
                  {item.descId && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {item.descId}
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    ID: #{item.id}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/social-impact/${item.id}/edit`}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-950 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
                    >
                      Edit
                    </Link>

                    {confirmId === item.id ? (
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="px-2 py-1 text-xs text-white bg-red-600 rounded-md"
                        >
                          {deletingId === item.id ? '...' : 'Ya'}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="px-2 py-1 text-xs text-gray-500"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus Program"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M2.5 4h11M5.5 4V2.5a1 1 0 011-1h3a1 1 0 011 1V4M6.5 7v5M9.5 7v5M4 4l.8 9.5a1 1 0 001 .5h4.4a1 1 0 001-.5L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-[#FAF9F7] text-gray-400 font-semibold tracking-wider uppercase text-[10px]">
                  <th className="py-3.5 px-6">Urutan</th>
                  <th className="py-3.5 px-4">Nama Program</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono text-gray-400">#{item.order}</td>
                    <td className="py-4 px-4 font-medium text-gray-900 max-w-sm truncate">
                      {item.titleId}
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      {item.categoryId || '—'}
                    </td>
                    <td className="py-4 px-4">
                      {item.published ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-500 font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/social-impact/${item.id}/edit`}
                          className="px-2.5 py-1 text-xs font-medium text-gray-700 hover:text-gray-950 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200"
                        >
                          Edit
                        </Link>
                        {confirmId === item.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-2 py-1 text-xs text-white bg-red-600 rounded"
                            >
                              Hapus
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="px-2 py-1 text-xs text-gray-500"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <path d="M2.5 4h11M5.5 4V2.5a1 1 0 011-1h3a1 1 0 011 1V4M6.5 7v5M9.5 7v5M4 4l.8 9.5a1 1 0 001 .5h4.4a1 1 0 001-.5L12 4" stroke="currentColor" strokeWidth="1.3" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
