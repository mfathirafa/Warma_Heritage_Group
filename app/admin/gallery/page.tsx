import { prisma } from '@/app/lib/prisma';
import { connection } from 'next/server';
import type { Metadata } from 'next';
import GalleryClient from './components/GalleryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manajemen Galeri & Foto Produk | Admin Warma Heritage Group',
};

export default async function AdminGalleryPage() {
  await connection();
  let photos: Array<{
    id: number;
    companySlug: string;
    titleId: string | null;
    titleEn: string | null;
    imageUrl: string;
    order: number;
    published: boolean;
    createdAt: string;
  }> = [];

  try {
    const rawPhotos = await prisma.companyPhoto.findMany({
      orderBy: [
        { companySlug: 'asc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    photos = rawPhotos.map((p) => ({
      id: p.id,
      companySlug: p.companySlug,
      titleId: p.titleId,
      titleEn: p.titleEn,
      imageUrl: p.imageUrl,
      order: p.order,
      published: p.published,
      createdAt: p.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('[AdminGalleryPage] Error fetching photos:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
              Media & Portofolio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-tight">
            Galeri & Foto Produk
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Kelola foto produk, kerajinan, dan dokumentasi kegiatan untuk masing-masing anak perusahaan.
          </p>
        </div>
      </div>

      <GalleryClient initialPhotos={photos} />
    </div>
  );
}
