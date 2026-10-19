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
  const photo = await prisma.companyPhoto.findUnique({ where: { id: Number(id) } });
  if (!photo) return NextResponse.json({ error: 'Foto tidak ditemukan' }, { status: 404 });
  return NextResponse.json(photo);
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { companySlug, titleId, titleEn, imageUrl, order, published } = body;

    const existing = await prisma.companyPhoto.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: 'Foto tidak ditemukan' }, { status: 404 });
    }

    const photo = await prisma.companyPhoto.update({
      where: { id: Number(id) },
      data: {
        companySlug: companySlug || existing.companySlug,
        titleId: titleId !== undefined ? (titleId?.trim() || null) : existing.titleId,
        titleEn: titleEn !== undefined ? (titleEn?.trim() || null) : existing.titleEn,
        imageUrl: imageUrl || existing.imageUrl,
        order: order !== undefined ? Number(order) : existing.order,
        published: published !== undefined ? Boolean(published) : existing.published,
      },
    });

    revalidatePath(`/companies/${photo.companySlug}`);
    if (existing.companySlug !== photo.companySlug) {
      revalidatePath(`/companies/${existing.companySlug}`);
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('[PUT /api/admin/company-photos/:id]', error);
    return NextResponse.json({ error: 'Gagal memperbarui foto perusahaan.' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.companyPhoto.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: 'Foto tidak ditemukan' }, { status: 404 });
    }

    await prisma.companyPhoto.delete({ where: { id: Number(id) } });

    revalidatePath(`/companies/${existing.companySlug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/company-photos/:id]', error);
    return NextResponse.json({ error: 'Gagal menghapus foto perusahaan.' }, { status: 500 });
  }
}
