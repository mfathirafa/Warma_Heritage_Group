import { COMPANY_SITE, COMPANY_PHONE, COMPANY_EMAIL } from '../lib/constants';

export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || COMPANY_SITE;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Warma Heritage Group',
        alternateName: 'WHG',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          '@id': `${baseUrl}/#logo`,
          url: `${baseUrl}/Logo_clear.png`,
          caption: 'Warma Heritage Group',
        },
        image: `${baseUrl}/Logo_clear.png`,
        description:
          'Holding company yang membangun dan mengembangkan berbagai bisnis yang berakar pada budaya, kerajinan, dan semangat kewirausahaan Indonesia.',
        email: COMPANY_EMAIL,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Jalan Sekar Tunjung XV No. 1A',
          addressLocality: 'Denpasar',
          addressRegion: 'Bali',
          postalCode: '80237',
          addressCountry: 'ID',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: COMPANY_PHONE,
          contactType: 'customer service',
          availableLanguage: ['Indonesian', 'English'],
        },
        subOrganization: [
          {
            '@type': 'Organization',
            name: 'Karya Rotan Indonesia',
            url: `${baseUrl}/companies/karya-rotan-indonesia`,
          },
          {
            '@type': 'Organization',
            name: 'Rattan Export House Indonesia',
            url: `${baseUrl}/companies/rattan-export-house-indonesia`,
          },
          {
            '@type': 'Organization',
            name: 'Kriya Kayu Nusantara',
            url: `${baseUrl}/companies/kriya-kayu-nusantara`,
          },
          {
            '@type': 'Organization',
            name: 'Nada Upacara Bali',
            url: `${baseUrl}/companies/nada-upacara-bali`,
          },
          {
            '@type': 'Organization',
            name: 'Bali Menari Academy',
            url: `${baseUrl}/companies/bali-menari-academy`,
          },
          {
            '@type': 'Organization',
            name: 'Niaga Rasa Indonesia',
            url: `${baseUrl}/companies/niaga-rasa-indonesia`,
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Warma Heritage Group',
        description:
          'Holding company yang membangun dan mengembangkan berbagai bisnis yang berakar pada budaya, kerajinan, dan semangat kewirausahaan Indonesia.',
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
        inLanguage: ['id-ID', 'en-US'],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}