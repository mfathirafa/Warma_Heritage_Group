import { prisma } from '@/app/lib/prisma';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogFormClient from '../../components/BlogFormClient';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Edit Artikel' };

export default async function EditBlogPage({ params }: Props) {
  await connection();
  const { id } = await params;
  let post = null;
  try {
    post = await prisma.post.findUnique({ where: { id: Number(id) } });
  } catch (error) {
    console.error('[EditBlogPage] Error fetching post:', error);
  }

  if (!post) notFound();

  return (
    <BlogFormClient
      mode="edit"
      postId={post.id}
      defaultValues={{
        titleId: post.titleId,
        titleEn: post.titleEn ?? '',
        excerptId: post.excerptId ?? '',
        excerptEn: post.excerptEn ?? '',
        contentId: post.contentId,
        contentEn: post.contentEn ?? '',
        category: post.category,
        author: post.author,
        readTime: post.readTime ?? '3 min',
        coverImage: post.coverImage ?? '',
        published: post.published,
      }}
    />
  );
}
