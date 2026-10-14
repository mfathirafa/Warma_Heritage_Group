import { getBlogPosts } from '../../lib/notion';
import BlogDetailClient from './BlogDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { COMPANY_SITE } from '../../lib/constants';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const allPosts = await getBlogPosts();
  const post = allPosts.find((p) => p.slug === slug) ?? null;

  if (!post) {
    return { title: 'Artikel Tidak Ditemukan | Warma Heritage Group' };
  }

  const title = post.titleId || post.titleEn || 'Artikel';
  const description = post.excerptId || post.excerptEn || '';
  const imageUrl = post.cover || '/Logo_clear.png';

  return {
    title: `${title} | Warma Heritage Group`,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${title} | Blog | Warma Heritage Group`,
      description,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: post.date || undefined,
      authors: ['Warma Heritage Group'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Warma Heritage Group`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const allPosts = await getBlogPosts();
  const post = allPosts.find((p) => p.slug === slug) ?? null;

  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || COMPANY_SITE;
  const title = post.titleId || post.titleEn;
  const description = post.excerptId || post.excerptEn;
  const imageUrl = post.cover || `${siteUrl}/Logo_clear.png`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: [imageUrl],
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${slug}`,
    },
    author: {
      '@type': 'Organization',
      name: 'Warma Heritage Group',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Warma Heritage Group',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/Logo_clear.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogDetailClient post={post} />
    </>
  );
}