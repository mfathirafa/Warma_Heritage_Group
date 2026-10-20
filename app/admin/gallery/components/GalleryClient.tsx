'use client';

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/app/admin/components/ToastProvider';

export interface PhotoItem {
  id: number;
  companySlug: string;
  titleId: string | null;
  titleEn: string | null;
  imageUrl: string;
  order: number;
  published: boolean;
  createdAt: string;
}

const COMPANIES = [
  { slug: 'karya-rotan-indonesia', name: 'Karya Rotan Indonesia', label: 'Produk Rotan' },
  { slug: 'rattan-export-house-indonesia', name: 'Rattan Export House (REHI)', label: 'Ekspor Rotan' },
  { slug: 'kriya-kayu-nusantara', name: 'Kriya Kayu Nusantara', label: 'Produk Kayu' },
  { slug: 'nada-upacara-bali', name: 'Nada Upacara Bali', label: 'Portofolio Acara' },
  { slug: 'bali-menari-academy', name: 'Bali Menari Academy', label: 'Kegiatan Kelas' },
  { slug: 'niaga-rasa-indonesia', name: 'Niaga Rasa Indonesia', label: 'Produk Komoditas' },
];

export function normalizeImageUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Convert Google Drive view/share links to direct high-res image thumbnails
  const match1 = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1 && match1[1]) {
    return `https://drive.google.com/thumbnail?id=${match1[1]}&sz=w1600`;
  }

  const match2 = trimmed.match(/drive\.google\.com\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/);
  if (match2 && match2[1]) {
    return `https://drive.google.com/thumbnail?id=${match2[1]}&sz=w1600`;
  }

  return trimmed;
}

export default function GalleryClient({ initialPhotos }: { initialPhotos: PhotoItem[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [localPreview, setLocalPreview] = useState<string>('');
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [importingUrl, setImportingUrl] = useState(false);

  // Modal Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    companySlug: 'karya-rotan-indonesia',
    titleId: '',
    titleEn: '',
    imageUrl: '',
    order: 1,
    published: true,
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Photos
  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      const matchCompany = selectedCompany === 'all' || p.companySlug === selectedCompany;
      const matchSearch =
        search.trim() === '' ||
        (p.titleId && p.titleId.toLowerCase().includes(search.toLowerCase())) ||
        (p.titleEn && p.titleEn.toLowerCase().includes(search.toLowerCase())) ||
        p.companySlug.toLowerCase().includes(search.toLowerCase());
      return matchCompany && matchSearch;
    });
  }, [photos, selectedCompany, search]);

  function getCompanyName(slug: string) {
    const found = COMPANIES.find((c) => c.slug === slug);
    return found ? found.name : slug;
  }

  function openAddModal() {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview('');
    setEditingPhoto(null);
    const targetSlug = selectedCompany !== 'all' ? selectedCompany : 'karya-rotan-indonesia';
    const companyPhotos = photos.filter((p) => p.companySlug === targetSlug);
    const nextOrder = companyPhotos.length > 0 ? Math.max(...companyPhotos.map((p) => p.order)) + 1 : 1;

    setFormData({
      companySlug: targetSlug,
      titleId: '',
      titleEn: '',
      imageUrl: '',
      order: nextOrder,
      published: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(photo: PhotoItem) {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview('');
    setEditingPhoto(photo);
    setFormData({
      companySlug: photo.companySlug,
      titleId: photo.titleId || '',
      titleEn: photo.titleEn || '',
      imageUrl: photo.imageUrl,
      order: photo.order,
      published: photo.published,
    });
    setIsModalOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 15MB
    if (file.size > 15 * 1024 * 1024) {
      toast('Ukuran file maksimal 15MB.', 'error');
      return;
    }

    // Instant local preview
    if (localPreview) URL.revokeObjectURL(localPreview);
    const objUrl = URL.createObjectURL(file);
    setLocalPreview(objUrl);

    // Auto-fill title if empty
    if (!formData.titleId.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setFormData((prev) => ({ ...prev, titleId: cleanName }));
    }

    setUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah foto.');
      }

      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      toast('Foto berhasil diunggah ke server!', 'success');
    } catch (err: any) {
      toast(err.message || 'Gagal mengunggah foto.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleImportUrl() {
    const trimmed = formData.imageUrl.trim();
    if (!trimmed) {
      toast('Masukkan URL gambar terlebih dahulu.', 'error');
      return;
    }

    setImportingUrl(true);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses gambar dari URL.');
      }

      if (localPreview) {
        URL.revokeObjectURL(localPreview);
        setLocalPreview('');
      }
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      toast('Gambar berhasil diunduh dan disimpan ke server!', 'success');
    } catch (err: any) {
      toast(err.message || 'Gagal memproses gambar.', 'error');
    } finally {
      setImportingUrl(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let finalImageUrl = normalizeImageUrl(formData.imageUrl);
    if (!finalImageUrl && !localPreview) {
      toast('Foto belum diunggah atau URL belum diisi.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // If it's a Google Drive link, auto-download to server so it never breaks
      if (finalImageUrl.includes('drive.google.com')) {
        try {
          const importRes = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: finalImageUrl }),
          });
          if (importRes.ok) {
            const importData = await importRes.json();
            if (importData.url) {
              finalImageUrl = importData.url;
            }
          }
        } catch {
          // fallback to normalized URL
        }
      }

      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
      };

      if (editingPhoto) {
        // UPDATE
        const res = await fetch(`/api/admin/company-photos/${editingPhoto.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const updated = await res.json();
        if (!res.ok) throw new Error(updated.error || 'Gagal memperbarui foto.');

        setPhotos((prev) =>
          prev.map((p) => (p.id === editingPhoto.id ? { ...p, ...updated } : p))
        );
        toast('Foto berhasil diperbarui!', 'success');
      } else {
        // CREATE
        const res = await fetch('/api/admin/company-photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const created = await res.json();
        if (!res.ok) throw new Error(created.error || 'Gagal menambahkan foto.');

        setPhotos((prev) => [created, ...prev]);
        toast('Foto berhasil ditambahkan ke galeri!', 'success');
      }

      if (localPreview) URL.revokeObjectURL(localPreview);
      setLocalPreview('');
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast(err.message || 'Terjadi kesalahan sistem.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTogglePublish(photo: PhotoItem) {
    try {
      const newStatus = !photo.published;
      // Optimistic update
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, published: newStatus } : p))
      );

      const res = await fetch(`/api/admin/company-photos/${photo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newStatus }),
      });

      if (!res.ok) {
        // Revert
        setPhotos((prev) =>
          prev.map((p) => (p.id === photo.id ? { ...p, published: photo.published } : p))
        );
        toast('Gagal mengubah status foto.', 'error');
      } else {
        toast(
          newStatus ? 'Foto sekarang tampil di web!' : 'Foto berhasil disembunyikan.',
          'success'
        );
        router.refresh();
      }
    } catch {
      toast('Terjadi kesalahan jaringan.', 'error');
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/company-photos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus foto.');

      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast('Foto berhasil dihapus.', 'success');
      router.refresh();
    } catch (err: any) {
      toast(err.message || 'Gagal menghapus foto.', 'error');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Informative Guidance Banner */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-3">
        <svg
          className="w-5 h-5 text-amber-800 shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.7}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold mb-0.5">Panduan Pengunggahan Foto:</p>
          <p>
            Unduh foto dari Google Drive Anda ke laptop/komputer, lalu unggah foto tersebut di bawah ini
            sesuai anak perusahaannya. Foto yang berstatus <strong>Tayang</strong> akan otomatis muncul
            langsung di bagian <em>Galeri / Portofolio</em> pada halaman anak perusahaan di web publik.
          </p>
        </div>
      </div>

      {/* Toolbar: Company Tabs & Add Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Company Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
          <button
            type="button"
            onClick={() => setSelectedCompany('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
              selectedCompany === 'all'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
            }`}
          >
            Semua ({photos.length})
          </button>
          {COMPANIES.map((c) => {
            const count = photos.filter((p) => p.companySlug === c.slug).length;
            const isSelected = selectedCompany === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setSelectedCompany(c.slug)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
                }`}
              >
                {c.name} {count > 0 && <span className="opacity-70 text-[11px]">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#141414] hover:bg-black text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Tambah Foto</span>
          </button>
        </div>
      </div>

      {/* Search & Sub-Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul foto atau anak perusahaan..."
            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
          />
          <svg
            className="absolute left-3 top-2.5 text-gray-400"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span>Menampilkan <strong>{filteredPhotos.length}</strong> foto</span>
          {selectedCompany !== 'all' && (
            <Link
              href={`/companies/${selectedCompany}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 underline underline-offset-2 ml-2"
            >
              <span>Lihat halaman web</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 mx-auto flex items-center justify-center text-gray-400 mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
              <path d="M21 15l-5-5L5 21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 mb-1">Belum ada foto</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            {selectedCompany !== 'all'
              ? `Belum ada foto untuk ${getCompanyName(selectedCompany)}. Klik tombol di bawah untuk menambahkan foto produk atau kegiatan.`
              : 'Belum ada foto yang diunggah. Mulai unggah foto produk dari Google Drive Anda.'}
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-medium px-4 py-2 rounded-lg cursor-pointer transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Unggah Foto Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group bg-white rounded-xl border border-gray-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                {failedImages[photo.id] ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gray-50 text-gray-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-1 text-gray-300">
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                      <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
                      <path d="M21 15l-5-5L5 21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[10px] text-gray-400">Gambar tidak dapat dimuat</span>
                  </div>
                ) : (
                  <Image
                    src={photo.imageUrl}
                    alt={photo.titleId || 'Foto Perusahaan'}
                    fill
                    unoptimized
                    onError={() => setFailedImages((prev) => ({ ...prev, [photo.id]: true }))}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}

                {/* Status Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs ${
                      photo.published
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-gray-800/80 text-gray-200'
                    }`}
                  >
                    {photo.published ? 'Tayang' : 'Draft'}
                  </span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                    #{photo.order}
                  </span>
                </div>

                {/* Quick Toggle Overlay */}
                <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(photo)}
                    title={photo.published ? 'Klik untuk sembunyikan' : 'Klik untuk tampilkan di web'}
                    className="p-1.5 rounded-md bg-white/90 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs cursor-pointer text-xs"
                  >
                    {photo.published ? (
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-800 line-clamp-1 mb-1">
                    {getCompanyName(photo.companySlug)}
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 line-clamp-1">
                    {photo.titleId || <span className="text-gray-400 italic">Tanpa judul</span>}
                  </h3>
                  {photo.titleEn && (
                    <p className="text-[11px] text-gray-400 italic line-clamp-1">
                      {photo.titleEn}
                    </p>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(photo)}
                      className="text-[11px] font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
                    >
                      Edit
                    </button>
                    <span className="text-gray-200">•</span>
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(photo)}
                      className="text-[11px] font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
                    >
                      {photo.published ? 'Sembunyikan' : 'Tayangkan'}
                    </button>
                  </div>

                  {confirmDeleteId === photo.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDelete(photo.id)}
                        disabled={deletingId === photo.id}
                        className="text-[10px] bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded font-medium cursor-pointer"
                      >
                        {deletingId === photo.id ? '...' : 'Hapus'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-[10px] text-gray-500 hover:text-gray-700 cursor-pointer px-1"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(photo.id)}
                      className="text-[11px] font-medium text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editingPhoto ? 'Edit Informasi Foto' : 'Tambah Foto ke Galeri'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              {/* Target Company */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Pilih Anak Perusahaan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.companySlug}
                  onChange={(e) => setFormData({ ...formData, companySlug: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                >
                  {COMPANIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} ({c.label})
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Upload / URL */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Unggah Gambar Foto <span className="text-red-500">*</span>
                </label>

                {/* Upload Button Box */}
                <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 text-center transition-all">
                  {(localPreview || formData.imageUrl) ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs">
                        <img
                          src={localPreview || formData.imageUrl}
                          alt="Pratinjau Foto"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="text-xs text-amber-700 hover:text-amber-800 font-medium cursor-pointer underline"
                        >
                          {uploading ? 'Mengunggah...' : 'Ganti Foto'}
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (localPreview) URL.revokeObjectURL(localPreview);
                            setLocalPreview('');
                            setFormData((p) => ({ ...p, imageUrl: '' }));
                          }}
                          className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <svg
                        className="w-8 h-8 text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-gray-900 hover:bg-black text-white px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all shadow-xs"
                      >
                        {uploading ? 'Mengunggah...' : 'Pilih File dari Komputer'}
                      </button>
                      <p className="text-[11px] text-gray-400 mt-2">
                        Format JPG, PNG, WebP (maks. 15MB)
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Direct URL input fallback */}
                <div className="mt-2">
                  <span className="text-[11px] text-gray-400">Atau masukkan URL gambar / link Google Drive:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        if (localPreview) {
                          URL.revokeObjectURL(localPreview);
                          setLocalPreview('');
                        }
                        setFormData({ ...formData, imageUrl: normalizeImageUrl(e.target.value) });
                      }}
                      placeholder="https://... atau link Google Drive atau /uploads/..."
                      className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                    {formData.imageUrl.startsWith('http') && (
                      <button
                        type="button"
                        onClick={handleImportUrl}
                        disabled={importingUrl}
                        className="shrink-0 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-medium transition-all cursor-pointer disabled:opacity-50"
                        title="Simpan gambar dari link ke server"
                      >
                        {importingUrl ? 'Memproses...' : 'Import URL'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Title ID & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Keterangan Foto (ID)
                  </label>
                  <input
                    type="text"
                    value={formData.titleId}
                    onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                    placeholder="Contoh: Kursi Rotan Teras"
                    className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Keterangan Foto (EN)
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Contoh: Patio Rattan Chair"
                    className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              {/* Order & Published Toggle */}
              <div className="grid grid-cols-2 gap-3 items-center pt-1">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Nomor Urut Tampil
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 1 })}
                    className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="publishedCheckbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer h-4 w-4"
                  />
                  <label htmlFor="publishedCheckbox" className="text-gray-700 font-medium cursor-pointer select-none">
                    Tayangkan di Website
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2 rounded-lg bg-gray-900 hover:bg-black text-white font-medium cursor-pointer transition-all disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : editingPhoto ? 'Simpan Perubahan' : 'Tambah Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
