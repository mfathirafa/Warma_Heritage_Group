'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '../../components/ToastProvider';
import { BLOG_CATEGORIES } from '@/app/lib/constants';

interface PostFormData {
  slug?: string;
  titleId: string;
  titleEn: string;
  excerptId: string;
  excerptEn: string;
  contentId: string;
  contentEn: string;
  category: string;
  author: string;
  readTime: string;
  coverImage: string;
  published: boolean;
}

const INITIAL: PostFormData = {
  titleId: '',
  titleEn: '',
  excerptId: '',
  excerptEn: '',
  contentId: '',
  contentEn: '',
  category: 'Wawasan',
  author: 'Warma Heritage Group',
  readTime: '3 menit',
  coverImage: '',
  published: false, // Default: draft — jangan langsung terbit
};

const CATEGORIES = BLOG_CATEGORIES;

const PRESET_IMAGES = [
  { label: 'Karya Rotan Indonesia', url: '/images/companies/karya-rotan-indonesia.png' },
  { label: 'Rattan Export House', url: '/images/companies/rattan-export-house-indonesia.png' },
  { label: 'Kriya Kayu Nusantara', url: '/images/companies/kriya-kayu-nusantara.png' },
  { label: 'Upacara Adat Bali', url: '/images/companies/upacara-adat-bali.png' },
  { label: 'Akademi Tari Bali', url: '/images/companies/tari-bali-heritage.png' },
];

interface Props {
  defaultValues?: Partial<PostFormData>;
  postId?: number;
  mode: 'create' | 'edit';
}

export default function BlogFormClient({ defaultValues, postId, mode }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<PostFormData>({ ...INITIAL, ...defaultValues });
  const [customSlug, setCustomSlug] = useState<string>(defaultValues?.slug || '');
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'id' | 'en'>('id');

  // Warn on unsaved changes when leaving page
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

  // Compute live word count & reading time
  const wordCount = useMemo(() => {
    const text = activeTab === 'id' ? form.contentId : form.contentEn;
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [form.contentId, form.contentEn, activeTab]);

  // Auto-update readTime from Indonesian content word count (200 wpm)
  const autoReadTime = useMemo(() => {
    const words = form.contentId.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} menit`;
  }, [form.contentId]);

  // Compute live slug
  const previewSlug = useMemo(() => {
    return form.titleId
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .slice(0, 100);
  }, [form.titleId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setIsDirty(true);
    // Clear validation error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  // Handle direct file upload
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
      toast('Gambar sampul berhasil diunggah langsung!', 'success');
    } catch (err: any) {
      toast(err.message || 'Gagal mengunggah gambar', 'error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  // Insert markdown helpers
  function insertMarkdown(tag: string, placeholder = 'teks') {
    const textarea = document.getElementById(
      activeTab === 'id' ? 'contentId' : 'contentEn'
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = activeTab === 'id' ? form.contentId : form.contentEn;
    const selected = current.substring(start, end) || placeholder;

    let replacement = '';
    if (tag === 'bold') replacement = `**${selected}**`;
    else if (tag === 'italic') replacement = `*${selected}*`;
    else if (tag === 'h2') replacement = `\n## ${selected}\n`;
    else if (tag === 'h3') replacement = `\n### ${selected}\n`;
    else if (tag === 'quote') replacement = `\n> ${selected}\n`;
    else if (tag === 'list') replacement = `\n- ${selected}\n`;

    const nextContent = current.substring(0, start) + replacement + current.substring(end);
    setForm((prev) => ({
      ...prev,
      [activeTab === 'id' ? 'contentId' : 'contentEn']: nextContent,
    }));
    setIsDirty(true);
  }

  async function handleSubmit(e: React.FormEvent, forcePublish?: boolean) {
    e.preventDefault();

    // Client-side visual validation
    const errors: Record<string, string> = {};
    if (!form.titleId.trim()) {
      errors.titleId = 'Judul artikel wajib diisi.';
    }
    if (!form.contentId.trim()) {
      errors.contentId = 'Isi konten artikel wajib diisi.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setActiveTab('id'); // Switch to ID tab where required fields reside
      toast('Mohon lengkapi field yang ditandai merah (*)', 'error');
      return;
    }

    setLoading(true);

    // Determine publish state
    const publishedState = forcePublish !== undefined ? forcePublish : form.published;
    const finalSlug = (customSlug || previewSlug || `artikel-${Date.now()}`).trim();

    try {
      const url = mode === 'edit' ? `/api/admin/posts/${postId}` : '/api/admin/posts';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: finalSlug,
          published: publishedState,
          readTime: autoReadTime, // Always use auto-calculated value
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan artikel.');
      }

      setIsDirty(false);

      toast(
        publishedState
          ? mode === 'create'
            ? 'Artikel berhasil diterbitkan!'
            : 'Artikel berhasil diperbarui dan diterbitkan!'
          : mode === 'create'
          ? 'Artikel disimpan sebagai draf.'
          : 'Artikel disimpan sebagai draf.',
        'success'
      );

      setTimeout(() => {
        router.push('/admin/blog');
        router.refresh();
      }, 700);
    } catch (err: any) {
      toast(err.message || 'Terjadi kesalahan saat menyimpan artikel.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sticky Action Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex items-center justify-between gap-4 sticky top-[68px] z-20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Kembali"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div>
            <h1 className="text-base font-serif font-medium text-gray-900">
              {mode === 'create' ? 'Tulis Artikel Baru' : 'Edit Artikel'}
            </h1>
            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
              {form.published ? (
                <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />Artikel Aktif</>
              ) : (
                <><span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />Draf</>
              )}
              {previewSlug && (
                <span className="text-gray-300 font-mono ml-1">/blog/{previewSlug}</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/blog"
            className="px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
          >
            Batal
          </Link>
          {/* Save as Draft — secondary button */}
          {(!form.published || mode === 'create') && (
            <button
              type="button"
              disabled={loading}
              onClick={(e) => handleSubmit(e as any, false)}
              className="px-3.5 py-2 text-xs font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-50 rounded-lg transition-all border border-gray-200 disabled:opacity-50"
            >
              Simpan Draf
            </button>
          )}
          {/* Publish — primary button */}
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e as any, true)}
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
              <span>
                {form.published && mode === 'edit' ? 'Perbarui Artikel' : 'Terbitkan'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Two-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bilingual Content Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
            {/* Language Tabs */}
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
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                  Utama
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`flex-1 py-3 px-4 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'en'
                    ? 'border-gray-900 text-gray-900 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>🇬🇧 Versi Bahasa Inggris</span>
                {form.titleEn ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold">
                    ✓ Lengkap
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold">
                    Belum Diisi
                  </span>
                )}
              </button>
            </div>

            {/* Editor Body */}
            <div className="p-6 space-y-5">
              {activeTab === 'id' ? (
                <>
                  {/* Title ID */}
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500 mb-2">
                      Judul Artikel (Bahasa Indonesia) *
                    </label>
                    <input
                      name="titleId"
                      value={form.titleId}
                      onChange={handleChange}
                      placeholder="Contoh: Menjaga Keberlanjutan Warisan Budaya Indonesia..."
                      className={`w-full bg-[#FAFAFA] border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none transition-all font-serif text-lg ${
                        fieldErrors.titleId
                          ? 'border-red-400 ring-2 ring-red-100'
                          : 'border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900'
                      }`}
                    />
                    {fieldErrors.titleId && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                        <span>⚠</span> {fieldErrors.titleId}
                      </p>
                    )}

                    {/* Slug Customization */}
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200/80 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] tracking-wider uppercase font-semibold text-gray-500">
                          Slug URL Publik
                        </label>
                        {customSlug && customSlug !== previewSlug && (
                          <button
                            type="button"
                            onClick={() => {
                              setCustomSlug('');
                              setIsDirty(true);
                            }}
                            className="text-[10px] text-amber-800 hover:underline cursor-pointer"
                          >
                            Reset ke Otomatis
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
                        <span className="text-gray-400">/blog/</span>
                        <input
                          type="text"
                          value={customSlug !== '' ? customSlug : previewSlug}
                          onChange={(e) => {
                            setCustomSlug(e.target.value.toLowerCase().replace(/[^\w-]/g, ''));
                            setIsDirty(true);
                          }}
                          placeholder="slug-artikel"
                          className="flex-1 bg-white border border-gray-200 rounded px-2.5 py-1 text-xs font-mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">
                        URL ini digunakan pengunjung publik untuk membaca artikel ini.
                      </p>
                    </div>
                  </div>

                  {/* Excerpt ID with Character Counter */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                        Ringkasan Singkat (Lead / Excerpt & Meta SEO)
                      </label>
                      <span className={`text-[11px] font-mono ${form.excerptId.length > 160 ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
                        <span className="lining-nums">{form.excerptId.length}</span> / 160 karakter
                      </span>
                    </div>
                    <textarea
                      name="excerptId"
                      value={form.excerptId}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Tulis ringkasan satu hingga dua kalimat yang menarik pembaca (rekomendasi: 120-160 karakter untuk pratinjau Google & WhatsApp)..."
                      className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all resize-none"
                    />
                  </div>

                  {/* Markdown Helper Toolbar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                        Isi Konten Lengkap (Mendukung Markdown) *
                      </label>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {wordCount} kata
                      </span>
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-t-lg border-b-0 text-xs">
                      <button
                        type="button"
                        onClick={() => insertMarkdown('bold', 'teks tebal')}
                        className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded font-bold"
                        title="Tebal (Bold)"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('italic', 'teks miring')}
                        className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded italic font-serif"
                        title="Miring (Italic)"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('h2', 'Sub Judul')}
                        className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded font-semibold text-[11px]"
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('h3', 'Sub Judul Kecil')}
                        className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded font-semibold text-[11px]"
                        title="Heading 3"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('quote', 'Kutipan inspiratif')}
                        className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded"
                        title="Quote"
                      >
                        ”
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('list', 'Poin narasi')}
                        className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded"
                        title="Bullet List"
                      >
                        • List
                      </button>
                    </div>

                    <textarea
                      id="contentId"
                      name="contentId"
                      value={form.contentId}
                      onChange={handleChange}
                      rows={14}
                      placeholder="Tulis artikel lengkap di sini. Gunakan format Markdown untuk penataan paragraf dan subjudul..."
                      className={`w-full bg-[#FAFAFA] border rounded-b-lg px-3.5 py-3 text-xs leading-relaxed text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none transition-all font-mono ${
                        fieldErrors.contentId
                          ? 'border-red-400 ring-2 ring-red-100'
                          : 'border-gray-200 focus:ring-1 focus:ring-gray-900'
                      }`}
                    />
                    {fieldErrors.contentId && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                        <span>⚠</span> {fieldErrors.contentId}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Title EN */}
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500 mb-2">
                      Article Title (English)
                    </label>
                    <input
                      name="titleEn"
                      value={form.titleEn}
                      onChange={handleChange}
                      placeholder="e.g. Preserving Indonesian Cultural Heritage Through Modern Business..."
                      className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all font-serif text-lg"
                    />
                  </div>

                  {/* Excerpt EN */}
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500 mb-2">
                      Short Summary / Excerpt (English)
                    </label>
                    <textarea
                      name="excerptEn"
                      value={form.excerptEn}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Brief one or two sentences in English..."
                      className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all resize-none"
                    />
                  </div>

                  {/* Content EN */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                        Full Article Content (English)
                      </label>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {wordCount} words
                      </span>
                    </div>

                    <textarea
                      id="contentEn"
                      name="contentEn"
                      value={form.contentEn}
                      onChange={handleChange}
                      rows={14}
                      placeholder="Write the full English translation here..."
                      className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3.5 py-3 text-xs leading-relaxed text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all font-mono"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Settings (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Status Publikasi */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400">
              Visibilitas & Status
            </h3>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200/60">
              <div>
                <p className="text-xs font-medium text-gray-900">
                  {form.published ? 'Publikasikan ke Publik' : 'Simpan Sebagai Draf'}
                </p>
                <p className="text-[11px] text-gray-400">
                  {form.published ? 'Dapat dibaca oleh semua pengunjung' : 'Hanya terlihat di admin panel'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
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
          </div>

          {/* Card: Kategori & Meta */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400">
              Pengaturan Taksonomi
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Kategori Artikel
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Nama Penulis / Redaksi
              </label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Warma Heritage Group"
                className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  Estimasi Waktu Baca
                </label>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">
                  Otomatis
                </span>
              </div>
              <input
                name="readTime"
                value={autoReadTime}
                readOnly
                className="w-full bg-gray-100/70 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-medium cursor-not-allowed lining-nums"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Dihitung otomatis (~200 kata/menit) dari panjang naskah artikel.
              </p>
            </div>
          </div>

          {/* Card: Direct File Upload & Cover Image */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400">
                Gambar Sampul (Cover Image)
              </h3>
              {form.coverImage && (
                <button
                  type="button"
                  onClick={() => {
                    setForm((p) => ({ ...p, coverImage: '' }));
                    setIsDirty(true);
                  }}
                  className="text-[11px] text-red-500 hover:underline cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>

            {/* Direct File Upload Button */}
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
              className="w-full py-2.5 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {uploadingImage ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-gray-700" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Mengunggah File...</span>
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

            <p className="text-[10px] text-gray-400 leading-relaxed">
              Disarankan rasio 16:9 (1200×675 px), maks. 5MB, format JPG, PNG, atau WebP. (SVG tidak diizinkan demi keamanan).
            </p>

            {/* Or URL input */}
            <div>
              <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wider">
                Atau Masukkan URL Gambar:
              </label>
              <input
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://... atau /uploads/..."
                className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all font-mono text-[11px]"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <p className="text-[10px] text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
                Pilih Dari Foto Unit Usaha:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setForm((p) => ({ ...p, coverImage: preset.url }));
                      setIsDirty(true);
                    }}
                    className="text-[10px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Preview */}
            {form.coverImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-inner">
                <Image
                  src={form.coverImage}
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                  unoptimized={form.coverImage.startsWith('http') || form.coverImage.startsWith('/uploads')}
                />
              </div>
            ) : (
              <div className="aspect-video rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs bg-gray-50/50 p-4 text-center">
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none" className="mb-2 text-gray-300">
                  <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" />
                  <path d="M14 11l-3.5-3.5L3 14" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <span>Pratinjau gambar akan tampil di sini</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Secondary Action Bar for long-form comfort */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-200 bg-white/50 p-4 rounded-xl">
        <Link
          href="/admin/blog"
          className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
        >
          Batal
        </Link>
        <div className="flex items-center gap-2">
          {(!form.published || mode === 'create') && (
            <button
              type="button"
              disabled={loading}
              onClick={(e) => handleSubmit(e as any, false)}
              className="px-4 py-2 text-xs font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-50 rounded-lg transition-all border border-gray-200 disabled:opacity-50 cursor-pointer"
            >
              Simpan Draf
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e as any, true)}
            className="inline-flex items-center gap-2 bg-[#141414] hover:bg-black text-white text-xs font-medium px-5 py-2 rounded-lg shadow-xs hover:shadow-md disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              'Menyimpan...'
            ) : form.published && mode === 'edit' ? (
              'Perbarui Artikel'
            ) : (
              'Terbitkan'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
