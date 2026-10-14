import { MetadataRoute } from 'next';
import { COMPANY_SITE } from './lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${COMPANY_SITE}/sitemap.xml`,
  };
}