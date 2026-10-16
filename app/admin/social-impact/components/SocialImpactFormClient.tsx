'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '../../components/ToastProvider';
import { SOCIAL_IMPACT_CATEGORIES } from '@/app/lib/constants';

interface SocialImpactFormData {
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  categoryId: string;
  categoryEn: string;
  coverImage: string;
  order: number;
  published: boolean;
}

const INITIAL: SocialImpactFormData = {
  titleId: '',
  titleEn: '',
  descId: '',
  descEn: '',
  categoryId: 'Pemberdayaan Komunitas',
  categoryEn: 'Community Empowerment',
  coverImage: '',
  order: 1,
  published: true,
};

const PRESET_IMAGES = [
  { label: 'Pengrajin Lokal', url: '/images/social/pemberdayaan-pengrajin-lokal.jpg' },
  { label: 'Seni Bali', url: '/images/social/pelestarian-seni-bali.jpg' },
  { label: 'Seniman Muda', url: '/images/social/pemberdayaan-seniman-muda.jpg' },
  { label: 'Wirausaha Lokal', url: '/images/social/pelatihan-wirausaha-komunitas-lokal.jpg' },
  { label: 'Internship Mahasiswa', url: '/images/social/mentorship-mahasiswa-internship.jpg' },
  { label: 'Panti Asuhan', url: '/images/social/berbagi-keceriaan-panti-asuhan.jpg' },
  { label: 'Lansia', url: '/images/social/pemeriksaan-kesehatan-lansia.jpg' },
];

interface Props {
  defaultValues?: Partial<SocialImpactFormData>;
  itemId?: number;
  mode: 'create' | 'edit';
}

export default function SocialImpactFormClient({ defaultValues, itemId, mode }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<SocialImpactFormData>({ ...INITIAL, ...defaultValues });
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'id' | 'en'>('id');

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setIsDirty(true);
    const { name, value, type } = e.target;
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : name === 'order'
          ? Number(value)
          : value,
    }));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah gambar');
      }

      setForm((prev) => ({ ...prev, coverImage: data.url }));
      setIsDirty(true);
      toast('Gambar program berhasil diunggah langsung!', 'success');
    } catch (err: any) {
      toast(err.message || 'Gagal mengunggah gambar', 'error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!form.titleId.trim()) {
      errors.titleId = 'Nama program wajib diisi.';
    }
    if (!form.descId.trim()) {
      errors.descId = 'Deskripsi program wajib diisi.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setActiveTab('id');
      toast('Mohon lengkapi field yang ditandai merah (*)', 'error');
      return;
    }

    setLoading(true);

    try {
      const url = mode === 'edit' ? `/api/admin/social-impact/${itemId}` : '/api/admin/social-impact';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan program sosial.');
      }

      setIsDirty(false);
      toast(
        mode === 'create'
          ? 'Program sosial baru berhasil dibuat!'
          : 'Perubahan program sosial berhasil diperbarui!',
        'success'
      );

      setTimeout(() => {
        router.push('/admin/social-impact');
        router.refresh();
      }, 700);
    } catch (err: any) {
      toast(err.message || 'Terjadi kesalahan server.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* Sticky Top Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex items-center justify-between gap-4 sticky top-[68px] z-20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/social-impact"
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Kembali"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div>
            <h1 className="text-base font-serif font-medium text-gray-900">
              {mode === 'create' ? 'Tambah Program Dampak Sosial' : 'Edit Program Sosial'}
            </h1>
            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <span>{form.published ? 'Status: Aktif di Website' : 'Status: Draf'}</span>
              {isDirty && (
                <>
                  <span>•</span>
                  <span className="text-amber-600 font-medium">Perubahan belum disimpan</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/social-impact"
            className="px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-[#141414] hover:bg-black text-white text-xs font-medium px-5 py-2 rounded-lg shadow-xs hover:shadow-md disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>{mode === 'create' ? 'Simpan Program' : 'Perbarui Program'}</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200/80 bg-[#FAFAFA]">
              <button
                type="button"
                onClick={() => setActiveTab('id')}
                className={`flex-1 py-3 px-4 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'id'
                    ? 'border-gray-900 text-gray-900 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>🇮🇩 Bahasa Indonesia</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`flex-1 py-3 px-4 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'en'
                    ? 'border-gray-900 text-gray-900 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>🇬🇧 English Version</span>
                {form.titleEn ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Tersedia
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                    Belum Diisi
                  </span>
                )}
              </button>
            </div>

            <div className="p-6 space-y-5">
              {activeTab === 'id' ? (
                <>
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500 mb-2">
                      Nama / Judul Program (ID) *
                    </label>
                    <input
                      name="titleId"
                      value={form.titleId}
                      onChange={handleChange}
                      placeholder="Contoh: Pemberdayaan Pengrajin Rotan & Kayu Lokal"
                      className={`w-full bg-[#FAFAFA] border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-serif focus:bg-white focus:outline-none transition-all ${
                        fieldErrors.titleId
                          ? 'border-red-400 ring-2 ring-red-100'
                          : 'border-gray-200 focus:ring-1 focus:ring-gray-900'
                      }`}
                    />
                    {fieldErrors.titleId && (
                      <p className="text-xs text-red-600 mt-1.5">⚠ {fieldErrors.titleId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500 mb-2">
                      Kategori Program *
                    </label>
                    <select
                      name="categoryId"
                      value={form.categoryId}
                      onChange={(e) => {
                        const selected = SOCIAL_IMPACT_CATEGORIES.find((c) => c.id === e.target.value);
                        if (selected) {
                          setForm((prev) => ({
                            ...prev,
                            categoryId: selected.id,
                            categoryEn: selected.en,
                          }));
                        } else {
                          setForm((prev) => ({ ...prev, categoryId: e.target.value }));
                        }
                        setIsDirty(true);
                      }}
                      className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all cursor-pointer"
                    >
                      {SOCIAL_IMPACT_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.id} ({cat.en})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      Kategori otomatis disinkronkan ke bahasa Inggris: <span className="font-medium text-gray-700">{form.categoryEn || '-'}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500 mb-2">
                      Deskripsi Program (ID) *
                    </label>
                    <textarea
                      name="descId"
                      value={form.descId}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Jelaskan tujuan, ruang lingkup, dan dampak nyata yang dihasilkan program ini bagi masyarakat lokal..."
                      className={`w-full bg-[#FAFAFA] border rounded-lg px-3.5 py-3 text-xs leading-relaxed text-gray-900 focus:bg-white focus:outline-none transition-all ${
                        fieldErrors.descId
                          ? 'border-red-400 ring-2 ring-red-100'
                          : 'border-gray-200 focus:ring-1 focus:ring-gray-900'
                      }`}
                    />
                    {fieldErrors.descId && (
                      <p className="text-xs text-red-600 mt-1.5">⚠ {fieldErrors.descId}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500 mb-2">
                      Program Title (EN)
                    </label>
                    <input
                      name="titleEn"
                      value={form.titleEn}
                      onChange={handleChange}
                      placeholder="e.g. Local Artisan Empowerment Initiative"
                      className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-serif focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500 mb-2">
                      Category (EN)
                    </label>
                    <select
                      name="categoryEn"
                      value={form.categoryEn}
                      onChange={(e) => {
                        const selected = SOCIAL_IMPACT_CATEGORIES.find((c) => c.en === e.target.value);
                        if (selected) {
                          setForm((prev) => ({
                            ...prev,
                            categoryId: selected.id,
                            categoryEn: selected.en,
                          }));
                        } else {
                          setForm((prev) => ({ ...prev, categoryEn: e.target.value }));
                        }
                        setIsDirty(true);
                      }}
                      className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all cursor-pointer"
                    >
                      {SOCIAL_IMPACT_CATEGORIES.map((cat) => (
                        <option key={cat.en} value={cat.en}>
                          {cat.en} ({cat.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500 mb-2">
                      Program Description (EN)
                    </label>
                    <textarea
                      name="descEn"
                      value={form.descEn}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Explain the objectives, scope, and direct community impact in English..."
                      className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3.5 py-3 text-xs leading-relaxed text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Live Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Settings */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400">
              Pengaturan & Prioritas
            </h3>

            {/* Toggle Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200/60">
              <div>
                <p className="text-xs font-medium text-gray-900">
                  {form.published ? 'Program Aktif' : 'Status Draf'}
                </p>
                <p className="text-[11px] text-gray-400">
                  {form.published ? 'Tampil di website publik' : 'Hanya tersimpan di admin'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setForm((p) => ({ ...p, published: !p.published }));
                  setIsDirty(true);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  form.published ? 'bg-[#141414]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    form.published ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Nomor Urutan Tampil (Order)
              </label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                min={1}
                className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all lining-nums"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Semakin kecil angkanya, semakin awal muncul di carousel website (contoh: 1, 2, 3...)
              </p>
            </div>

            {/* Direct File Upload & Preset Visual Picker */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Foto Sampul Program
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-full mb-2.5 py-2.5 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {uploadingImage ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-gray-700" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Mengunggah Foto...</span>
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M8 11V3M4.5 6.5L8 3l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2.5 13.5h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    <span>Upload Foto dari Komputer</span>
                  </>
                )}
              </button>

              <div className="mb-3">
                <input
                  name="coverImage"
                  value={form.coverImage}
                  onChange={handleChange}
                  placeholder="Atau masukkan path / URL gambar..."
                  className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all font-mono text-[11px]"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Format: JPG, PNG, WebP (maks. 5MB). SVG dinonaktifkan demi keamanan.
                </p>
              </div>

              {/* Visual Thumbnail Gallery */}
              <div>
                <p className="text-[11px] font-medium text-gray-600 mb-2">
                  Atau pilih dari galeri program Warma:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {PRESET_IMAGES.map((p) => {
                    const isSelected = form.coverImage === p.url;
                    return (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, coverImage: p.url }));
                          setIsDirty(true);
                        }}
                        className={`group relative rounded-lg border text-left overflow-hidden transition-all cursor-pointer ${
                          isSelected
                            ? 'border-gray-950 ring-2 ring-gray-950/20'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-gray-100">
                          <Image
                            src={p.url}
                            alt={p.label}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="120px"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-gray-950 text-white rounded-full p-0.5 shadow-sm">
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-1.5 bg-white">
                          <p className="text-[10px] font-medium text-gray-800 truncate" title={p.label}>
                            {p.label}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Live Card Preview */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400">
                Pratinjau Kartu Publik
              </h3>
              <span className="text-[10px] text-gray-400 font-mono">Tampilan Mobile</span>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3] bg-gray-100">
                {form.coverImage ? (
                  <Image
                    src={form.coverImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized={form.coverImage.startsWith('http') || form.coverImage.startsWith('/uploads')}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="font-serif text-xs">Foto Sampul Program</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-medium lining-nums px-2.5 py-1 rounded-full shadow-sm">
                  #{form.order}
                </div>
                {!form.published && (
                  <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm">
                    Draf
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5">
                <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-amber-800 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                  {form.categoryId || 'Kategori Program'}
                </span>
                <h4 className="text-base font-serif font-medium text-gray-950 mt-2.5 line-clamp-2 leading-snug">
                  {form.titleId || 'Judul Program Dampak Sosial'}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-3 mt-2 leading-relaxed">
                  {form.descId || 'Deskripsi program akan tampil di sini saat pengunjung menelusuri program sosial Warma Heritage Group...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Secondary Action Bar */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200/80 shadow-xs">
        <p className="text-xs text-gray-500">
          Pastikan semua data berbahasa Indonesia dan foto telah terisi dengan tepat sebelum menyimpan.
        </p>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/social-impact"
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-[#141414] hover:bg-black text-white text-xs font-medium px-5 py-2 rounded-lg shadow-xs hover:shadow-md disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? 'Menyimpan...' : mode === 'create' ? 'Simpan Program' : 'Perbarui Program'}
          </button>
        </div>
      </div>
    </form>
  );
}
