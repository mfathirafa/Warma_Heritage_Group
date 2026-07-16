import type { Metadata } from "next";
import { Inter, Sorts_Mill_Goudy } from "next/font/google";
import "./globals.css";
import JsonLd from './components/JsonLd';
import BackToTop from './components/BackToTop';

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

export const metadata: Metadata = {
  title: {
    default: 'Warma Heritage Group',
    template: '%s | Warma Heritage Group',
  },
  description:
    "Holding company yang membangun dan mengembangkan berbagai bisnis yang berakar pada budaya, kerajinan, dan semangat kewirausahaan Indonesia.",
  keywords: [
    "Warma Heritage Group",
    "holding company",
    "Bali",
    "warisan budaya",
    "sustainability",
    "rotan",
    "kerajinan",
  ],
  authors: [{ name: 'Warma Heritage Group'}],
  creator: 'Warma Heritage Group',
  metadataBase: new URL('https://warma-heritage-group.vercel.app'),
  openGraph: {
    title: "Warma Heritage Group",
    description:
      "Holding company yang membangun dan mengembangkan berbagai bisnis yang berakar pada budaya, kerajinan, dan semangat kewirausahaan Indonesia.",
    url: 'https://warma-heritage-group.vercel.app',
    siteName: 'Warma Heritage Group',
    locale: "id_ID",
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
    title: 'Warma Heritage Group',
    description: 'Holding company yang membangun dan mengembangkan berbagai bisnis yang berakar pada budaya, kerajinan, dan semangat kewirausahaan Indonesia.',
    images: ['/Logo_clear.png'],
  },
  icons: {
    icon: '/Logo_clear.png',
    apple: '/Logo_clear.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? '7JDJCwm4tTGmXT8I5oVcc22OOsW7TNb7kKSPGxG8HrM',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${sortMillGoudy.className}`}>
        <JsonLd />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}