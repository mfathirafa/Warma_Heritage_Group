import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/app/lib/session';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Props) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
  }

  const { id } = await params;
  const item = await prisma.socialImpact.findUnique({ where: { id: Number(id) } });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { titleId, titleEn, descId, descEn, categoryId, categoryEn, coverImage, order, published } = body;

    if (!titleId || !descId) {
      return NextResponse.json({ error: 'Judul dan deskripsi (ID) wajib diisi.' }, { status: 400 });
    }

    const item = await prisma.socialImpact.update({
      where: { id: Number(id) },
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

    return NextResponse.json(item);
  } catch (error) {
    console.error('[PUT /api/admin/social-impact/:id]', error);
    return NextResponse.json({ error: 'Gagal memperbarui program.' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.socialImpact.delete({ where: { id: Number(id) } });

    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/social-impact/:id]', error);
    return NextResponse.json({ error: 'Gagal menghapus program.' }, { status: 500 });
  }
}
