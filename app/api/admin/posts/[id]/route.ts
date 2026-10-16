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
  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { titleId, titleEn, slug, excerptId, excerptEn, contentId, contentEn, category, author, readTime, coverImage, published } = body;

    if (!titleId || !contentId) {
      return NextResponse.json({ error: 'Judul dan konten (ID) wajib diisi.' }, { status: 400 });
    }

    const updateData: any = {
      titleId,
      titleEn: titleEn || null,
      excerptId: excerptId || null,
      excerptEn: excerptEn || null,
      contentId,
      contentEn: contentEn || null,
      category: category || 'Wawasan',
      author: author || 'Warma Heritage Group',
      readTime: readTime || '3 menit',
      coverImage: coverImage || null,
      published: Boolean(published),
    };

    if (slug && typeof slug === 'string' && slug.trim()) {
      updateData.slug = slug.trim();
    }

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: updateData,
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/');

    return NextResponse.json(post);
  } catch (error) {
    console.error('[PUT /api/admin/posts/:id]', error);
    return NextResponse.json({ error: 'Gagal memperbarui artikel.' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.post.findUnique({ where: { id: Number(id) } });
    await prisma.post.delete({ where: { id: Number(id) } });

    revalidatePath('/blog');
    if (existing?.slug) {
      revalidatePath(`/blog/${existing.slug}`);
    }
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/posts/:id]', error);
    return NextResponse.json({ error: 'Gagal menghapus artikel.' }, { status: 500 });
  }
}
