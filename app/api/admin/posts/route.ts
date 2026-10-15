import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 200);
}

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titleId, titleEn, excerptId, excerptEn, contentId, contentEn, category, author, readTime, coverImage, published } = body;

    if (!titleId || !contentId) {
      return NextResponse.json({ error: 'Judul dan konten (ID) wajib diisi.' }, { status: 400 });
    }

    // Generate unique slug
    let slug = slugify(titleId);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const post = await prisma.post.create({
      data: {
        slug,
        titleId,
        titleEn: titleEn || null,
        excerptId: excerptId || null,
        excerptEn: excerptEn || null,
        contentId,
        contentEn: contentEn || null,
        category: category || 'Berita',
        author: author || 'Warma Heritage Group',
        readTime: readTime || '3 min',
        coverImage: coverImage || null,
        published: Boolean(published),
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/posts]', error);
    return NextResponse.json({ error: 'Gagal membuat artikel.' }, { status: 500 });
  }
}
