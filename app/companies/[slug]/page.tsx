import { notFound } from 'next/navigation';
import CompanyDetailClient from './CompanyDetailClient';

export const companies: Record<string, {
  nameId: string; nameEn: string;
  taglineId: string; taglineEn: string;
  descId: string; descEn: string;
  wa: string; industry: string;
  waMessageId: string; waMessageEn: string;
}> = {
  'karya-rotan-indonesia': {
    nameId: 'Karya Rotan Indonesia', nameEn: 'Karya Rotan Indonesia',
    taglineId: 'Produsen & eksportir produk rotan berkualitas tinggi berbasis kearifan lokal Indonesia.',
    taglineEn: 'Producer & exporter of high-quality rattan products rooted in local Indonesian craftsmanship.',
    descId: 'Karya Rotan Indonesia adalah perusahaan yang bergerak di bidang produksi dan ekspor produk rotan berkualitas tinggi. Dengan mengutamakan kearifan lokal dan keahlian pengrajin Indonesia, kami menghadirkan produk rotan yang memenuhi standar internasional.',
    descEn: 'Karya Rotan Indonesia is a company engaged in the production and export of high-quality rattan products. By prioritizing local wisdom and the expertise of Indonesian artisans, we deliver rattan products that meet international standards.',
    wa: '6281239669880', industry: 'Rattan',
    waMessageId: 'Halo%20Karya%20Rotan%20Indonesia%2C%20saya%20tertarik%20dengan%20produk%20rotan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Karya%20Rotan%20Indonesia%2C%20I%20am%20interested%20in%20your%20rattan%20products.%20Could%20you%20tell%20me%20more%3F',
  },
  'rattan-export-house-indonesia': {
    nameId: 'Rattan Export House Indonesia', nameEn: 'Rattan Export House Indonesia',
    taglineId: 'Menghubungkan produk rotan Indonesia dengan pasar internasional secara profesional.',
    taglineEn: 'Connecting Indonesian rattan products to international markets professionally.',
    descId: 'Rattan Export House Indonesia berfokus pada ekspor produk rotan ke pasar global. Kami menjadi jembatan antara pengrajin rotan Indonesia dengan pembeli internasional, memastikan kualitas dan ketepatan waktu pengiriman.',
    descEn: 'Rattan Export House Indonesia focuses on exporting rattan products to global markets. We bridge Indonesian rattan artisans with international buyers, ensuring quality and timely delivery.',
    wa: '6281239669880', industry: 'Rattan Export',
    waMessageId: 'Halo%20Rattan%20Export%20House%20Indonesia%2C%20saya%20tertarik%20untuk%20mengekspor%20produk%20rotan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Rattan%20Export%20House%20Indonesia%2C%20I%20am%20interested%20in%20exporting%20your%20rattan%20products.%20Could%20you%20tell%20me%20more%3F',
  },
  'kriya-kayu-nusantara': {
    nameId: 'Kriya Kayu Nusantara', nameEn: 'Kriya Kayu Nusantara',
    taglineId: 'Kerajinan kayu premium berbasis kearifan dan seni budaya Nusantara.',
    taglineEn: 'Premium woodcraft based on the art and wisdom of the Nusantara archipelago.',
    descId: 'Kriya Kayu Nusantara menghadirkan kerajinan kayu premium yang terinspirasi dari kekayaan seni dan budaya Nusantara. Setiap produk dibuat dengan tangan oleh pengrajin terampil menggunakan bahan kayu pilihan.',
    descEn: 'Kriya Kayu Nusantara presents premium woodcraft inspired by the richness of Nusantara arts and culture. Each product is handcrafted by skilled artisans using selected quality wood.',
    wa: '6281239669880', industry: 'Woodcraft',
    waMessageId: 'Halo%20Kriya%20Kayu%20Nusantara%2C%20saya%20tertarik%20dengan%20produk%20kerajinan%20kayu%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Kriya%20Kayu%20Nusantara%2C%20I%20am%20interested%20in%20your%20woodcraft%20products.%20Could%20you%20tell%20me%20more%3F',
  },
  'nada-upacara-bali': {
    nameId: 'Nada Upacara Bali', nameEn: 'Nada Upacara Bali',
    taglineId: 'Penyedia lengkap kebutuhan upacara adat dan ritual keagamaan Bali.',
    taglineEn: 'Complete provider of Balinese traditional ceremonial and religious ritual needs.',
    descId: 'Nada Upacara Bali hadir sebagai penyedia terpercaya untuk kebutuhan upacara adat dan ritual keagamaan di Bali. Kami menyediakan berbagai perlengkapan upacara yang dibuat dengan penuh ketulusan dan mengikuti tradisi leluhur.',
    descEn: 'Nada Upacara Bali is a trusted provider for traditional ceremonial and religious ritual needs in Bali. We provide various ceremonial supplies made with sincerity and following ancestral traditions.',
    wa: '6281239669880', industry: 'Cultural & Ceremony',
    waMessageId: 'Halo%20Nada%20Upacara%20Bali%2C%20saya%20tertarik%20dengan%20layanan%20upacara%20adat%20Bali%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Nada%20Upacara%20Bali%2C%20I%20am%20interested%20in%20your%20Balinese%20ceremonial%20services.%20Could%20you%20tell%20me%20more%3F',
  },
  'bali-menari': {
    nameId: 'Bali Menari', nameEn: 'Bali Menari',
    taglineId: 'Seni pertunjukan dan tari tradisional Bali yang memukau dunia.',
    taglineEn: 'Captivating Balinese traditional dance and performing arts for the world.',
    descId: 'Bali Menari adalah perusahaan seni pertunjukan yang berfokus pada pelestarian dan promosi tari tradisional Bali. Kami menghadirkan pertunjukan tari Bali yang autentik untuk berbagai acara lokal maupun internasional.',
    descEn: 'Bali Menari is a performing arts company focused on preserving and promoting traditional Balinese dance. We present authentic Balinese dance performances for various local and international events.',
    wa: '6281239669880', industry: 'Performing Arts',
    waMessageId: 'Halo%20Bali%20Menari%2C%20saya%20tertarik%20dengan%20pertunjukan%20tari%20Bali%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Bali%20Menari%2C%20I%20am%20interested%20in%20your%20Balinese%20dance%20performances.%20Could%20you%20tell%20me%20more%3F',
  },
  'niaga-rasa-indonesia': {
    nameId: 'Niaga Rasa Indonesia', nameEn: 'Niaga Rasa Indonesia',
    taglineId: 'Usaha kuliner autentik berbasis cita rasa dan kekayaan kuliner Nusantara.',
    taglineEn: 'Authentic culinary business rooted in the rich flavors of the Nusantara archipelago.',
    descId: 'Niaga Rasa Indonesia bergerak di bidang kuliner autentik yang mengangkat cita rasa dan kekayaan kuliner Nusantara. Kami menghadirkan pengalaman kuliner yang memadukan tradisi dengan sentuhan modern.',
    descEn: 'Niaga Rasa Indonesia operates in the authentic culinary sector, elevating the flavors and richness of Nusantara cuisine. We present culinary experiences that combine tradition with a modern touch.',
    wa: '6281239669880', industry: 'Culinary',
    waMessageId: 'Halo%20Niaga%20Rasa%20Indonesia%2C%20saya%20tertarik%20dengan%20produk%20kuliner%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Niaga%20Rasa%20Indonesia%2C%20I%20am%20interested%20in%20your%20culinary%20products.%20Could%20you%20tell%20me%20more%3F',
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const company = companies[slug];
  if (!company) notFound();
  return <CompanyDetailClient company={company} slug={slug} />;
}