import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/app/lib/session';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const companySlug = searchParams.get('companySlug');

  const where = companySlug ? { companySlug } : {};
  const photos = await prisma.companyPhoto.findMany({
    where,
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
    }

    const body = await request.json();
    const { companySlug, titleId, titleEn, imageUrl, order, published } = body;

    if (!companySlug || !imageUrl) {
      return NextResponse.json({ error: 'Perusahaan dan URL foto wajib diisi.' }, { status: 400 });
    }

    // Auto-calculate order if not provided
    let calculatedOrder = Number(order);
    if (isNaN(calculatedOrder) || calculatedOrder === 0) {
      const highestOrder = await prisma.companyPhoto.findFirst({
        where: { companySlug },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      calculatedOrder = (highestOrder?.order ?? 0) + 1;
    }

    const photo = await prisma.companyPhoto.create({
      data: {
        companySlug,
        titleId: titleId?.trim() || null,
        titleEn: titleEn?.trim() || null,
        imageUrl,
        order: calculatedOrder,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    revalidatePath(`/companies/${companySlug}`);

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/company-photos]', error);
    return NextResponse.json({ error: 'Gagal menambahkan foto perusahaan.' }, { status: 500 });
  }
}
