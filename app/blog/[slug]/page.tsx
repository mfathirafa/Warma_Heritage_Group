import { getBlogPosts } from '../../lib/notion';
import BlogDetailClient from './BlogDetailClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

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