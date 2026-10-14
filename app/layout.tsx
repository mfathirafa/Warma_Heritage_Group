import type { Metadata } from "next";
import { Inter, Sorts_Mill_Goudy } from "next/font/google";
import "./globals.css";
import JsonLd from './components/JsonLd';
import BackToTop from './components/BackToTop';
import { COMPANY_SITE } from './lib/constants';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sortMillGoudy = Sorts_Mill_Goudy({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || COMPANY_SITE;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Warma Heritage Group | Sustainable Indonesian Heritage Holding',
    template: '%s | Warma Heritage Group',
  },
  description:
    "Holding company yang membangun dan mengembangkan berbagai bisnis yang berakar pada budaya, kerajinan, dan semangat kewirausahaan Indonesia.",
  keywords: [
    "Warma Heritage Group",
    "holding company Bali",
    "warisan budaya Indonesia",
    "kerajinan rotan Indonesia",
    "furnitur rotan ekspor",
    "kriya kayu Nusantara",
    "upacara adat Bali",
    "akademi tari Bali",
    "sustainability",
    "sustainable business Indonesia",
  ],
  authors: [{ name: 'Warma Heritage Group', url: siteUrl }],
  creator: 'Warma Heritage Group',
  publisher: 'Warma Heritage Group',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Warma Heritage Group | Sustainable Indonesian Heritage Holding",
    description:
      "Holding company yang membangun dan mengembangkan berbagai bisnis yang berakar pada budaya, kerajinan, dan semangat kewirausahaan Indonesia.",
    url: siteUrl,
    siteName: 'Warma Heritage Group',
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: '/Logo_clear.png',
        width: 1200,
        height: 630,
        alt: 'Warma Heritage Group',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warma Heritage Group | Sustainable Indonesian Heritage Holding',
    description: 'Holding company yang membangun dan mengembangkan berbagai bisnis yang berakar pada budaya, kerajinan, dan semangat kewirausahaan Indonesia.',
    images: ['/Logo_clear.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/Logo_clear.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? 'Fz6s98hmeB0dt3-s0_m2c4Pb-8PaiPlBEm9bs-V-VQk',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${sortMillGoudy.className}`}>
        <JsonLd />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}