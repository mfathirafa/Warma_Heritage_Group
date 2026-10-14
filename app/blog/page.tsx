import { getBlogPosts } from '../lib/notion';
import BlogClient from './BlogClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Artikel',
  description: 'Kumpulan artikel, wawasan, dan cerita di balik Warma Heritage Group dan anak-anak perusahaannya.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog & Artikel | Warma Heritage Group',
    description: 'Kumpulan artikel, wawasan, dan cerita di balik Warma Heritage Group dan anak-anak perusahaannya.',
    url: '/blog',
    images: [{ url: '/Logo_clear.png', width: 1200, height: 630, alt: 'Warma Heritage Group Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Artikel | Warma Heritage Group',
    description: 'Kumpulan artikel, wawasan, dan cerita di balik Warma Heritage Group dan anak-anak perusahaannya.',
    images: ['/Logo_clear.png'],
  },
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return <BlogClient posts={posts} />;
}