import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';
import SocialImpactTableClient from './components/SocialImpactTableClient';

export const metadata: Metadata = { title: 'Manajemen Dampak Sosial' };

export default async function AdminSocialImpactPage() {
  const items = await prisma.socialImpact.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      titleId: true,
      categoryId: true,
      descId: true,
      coverImage: true,
      order: true,
      published: true,
      createdAt: true,
    },
  });

  const publishedCount = items.filter((i) => i.published).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
              Tanggung Jawab Sosial (CSR)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-tight">
            Inisiatif & Dampak Sosial
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Program pemberdayaan pengrajin, pelestarian adat & seni, serta beasiswa komunitas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/social-impact/new"
            className="inline-flex items-center gap-2 bg-[#141414] hover:bg-black text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Program Baru</span>
          </Link>
        </div>
      </div>

      <SocialImpactTableClient
        items={items.map((i) => ({
          ...i,
          createdAt: i.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
