import { MetadataRoute } from 'next';
import { getBlogPosts } from './lib/notion';
import { COMPANY_SITE } from './lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || COMPANY_SITE;
  let posts: Awaited<ReturnType<typeof getBlogPosts>> = [];
  try {
    posts = await getBlogPosts();
  } catch (e) {
    console.warn('Sitemap: gagal memuat blog posts dari Notion', e);
  }

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const companySlugs = [
    'karya-rotan-indonesia',
    'rattan-export-house-indonesia',
    'kriya-kayu-nusantara',
    'nada-upacara-bali',
    'bali-menari-academy',
    'niaga-rasa-indonesia',
  ];

  const companyUrls = companySlugs.map((slug) => ({
    url: `${baseUrl}/companies/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...companyUrls,
    ...blogUrls,
  ];
}