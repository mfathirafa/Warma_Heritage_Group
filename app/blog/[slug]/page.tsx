import { getBlogPosts, BlogPost } from '../../lib/notion';
import BlogDetailClient from './BlogDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const allPosts = await getBlogPosts();
  const post = allPosts.find(p => p.slug === slug) ?? null;

  if (!post) {
    return { title: 'Artikel Tidak Ditemukan' };
  }

  const title = post.titleEn || post.titleId;
  const description = post.excerptEn || post.excerptId || '';

  return {
    title: `${title} | Warma Heritage Group`,
    description,
    openGraph: {
      title: `${title} | Blog | Warma Heritage Group`,
      description,
      images: post.cover ? [{ url: post.cover, width: 1200, height: 630 }] : [{ url: '/Logo_clear.png', width: 1200, height: 630 }],
    },
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const allPosts = await getBlogPosts();
  const post = allPosts.find(p => p.slug === slug) ?? null;

  if (!post) notFound();

  return <BlogDetailClient post={post} />;
}