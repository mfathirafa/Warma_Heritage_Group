import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogFormClient from '../../components/BlogFormClient';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: 'Edit Artikel' };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id: Number(id) } });

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
