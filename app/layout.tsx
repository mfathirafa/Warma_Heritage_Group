import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Warma Heritage Group",
  description:
    "Holding company yang membawahi 6 anak perusahaan berbasis warisan budaya Indonesia.",
  keywords: [
    "Warma Heritage Group",
    "holding company",
    "Bali",
    "warisan budaya",
    "sustainability",
  ],
  openGraph: {
    title: "Warma Heritage Group",
    description:
      "Holding company yang membawahi 6 anak perusahaan berbasis warisan budaya Indonesia.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}