import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/app/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
  }

  const items = await prisma.socialImpact.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
    }

    const body = await request.json();
    const { titleId, titleEn, descId, descEn, categoryId, categoryEn, coverImage, order, published } = body;

    if (!titleId || !descId) {
      return NextResponse.json({ error: 'Judul dan deskripsi (ID) wajib diisi.' }, { status: 400 });
    }

    const item = await prisma.socialImpact.create({
      data: {
        titleId,
        titleEn: titleEn || null,
        descId,
        descEn: descEn || null,
        categoryId: categoryId || null,
        categoryEn: categoryEn || null,
        coverImage: coverImage || null,
        order: Number(order) || 0,
        published: Boolean(published),
      },
    });

    revalidatePath('/');

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/social-impact]', error);
    return NextResponse.json({ error: 'Gagal membuat program.' }, { status: 500 });
  }
}
