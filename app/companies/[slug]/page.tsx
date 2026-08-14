import { notFound } from 'next/navigation';
import CompanyDetailClient from './CompanyDetailClient';
import type { Metadata } from 'next';

export const companies: Record<string, {
  nameId: string; nameEn: string;
  taglineId: string; taglineEn: string;
  descId: string; descEn: string;
  wa: string; industry: string;
  waMessageId: string; waMessageEn: string;
  highlights: { titleId: string; titleEn: string; descId: string; descEn: string; }[];
  services: { titleId: string; titleEn: string; descId: string; descEn: string; }[];
  portofolioLabelId: string;
  portofolioLabelEn: string;
}> = {
  'karya-rotan-indonesia': {
    nameId: 'Karya Rotan Indonesia',
    nameEn: 'Karya Rotan Indonesia',
    taglineId: 'Produsen & eksportir produk rotan berkualitas tinggi berbasis kearifan lokal Indonesia.',
    taglineEn: 'Producer & exporter of high-quality rattan products rooted in local Indonesian craftsmanship.',
    descId: 'Merancang dan memproduksi furnitur rotan custom, pencahayaan, dan produk interior untuk hotel, vila, restoran, serta ruang komersial.',
    descEn: 'Designing and manufactures custom rattan furniture, lighting, and interior products for hotels, villas, restaurants, and commercial spaces.',
    wa: '6281239669880',
    industry: 'Rattan',
    waMessageId: 'Halo%20Karya%20Rotan%20Indonesia%2C%20saya%20tertarik%20dengan%20produk%20rotan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Karya%20Rotan%20Indonesia%2C%20I%20am%20interested%20in%20your%20rattan%20products.%20Could%20you%20tell%20me%20more%3F',
    highlights: [
      { titleId: '100% Pengrajin Lokal', titleEn: '100% Local Artisans', descId: 'Setiap produk dikerjakan oleh pengrajin rotan lokal berpengalaman yang menjaga kualitas dan keaslian setiap karya.', descEn: 'Every product is crafted by experienced local rattan artisans who maintain the quality and authenticity of each piece.' },
      { titleId: 'Material Berkelanjutan', titleEn: 'Sustainable Materials', descId: 'Kami menggunakan bahan rotan yang dipanen secara bertanggung jawab untuk menjaga kelestarian alam Indonesia.', descEn: 'We use responsibly harvested rattan materials to preserve Indonesia\'s natural environment.' },
      { titleId: 'Standar Ekspor Internasional', titleEn: 'International Export Standards', descId: 'Produk kami telah memenuhi standar kualitas internasional dan telah diekspor ke berbagai pasar global.', descEn: 'Our products meet international quality standards and have been exported to various global markets.' },
    ],
    services: [
      { titleId: 'Furnitur Rotan', titleEn: 'Rattan Furniture', descId: 'Kursi, meja, lemari, dan berbagai furnitur rotan premium untuk kebutuhan indoor maupun outdoor.', descEn: 'Chairs, tables, cabinets, and various premium rattan furniture for indoor and outdoor use.' },
      { titleId: 'Kerajinan Dekoratif', titleEn: 'Decorative Crafts', descId: 'Produk kerajinan rotan dekoratif berkualitas tinggi untuk mempercantik ruangan.', descEn: 'High-quality decorative rattan craft products to beautify living spaces.' },
      { titleId: 'Bahan Baku Rotan', titleEn: 'Raw Rattan Materials', descId: 'Penyediaan bahan baku rotan pilihan untuk kebutuhan industri dan pengrajin.', descEn: 'Supply of selected raw rattan materials for industrial and artisan needs.' },
      { titleId: 'Ekspor Rotan', titleEn: 'Rattan Export', descId: 'Layanan ekspor produk rotan ke pasar internasional dengan pengurusan dokumen lengkap.', descEn: 'Rattan product export services to international markets with complete documentation.' },
    ],
    portofolioLabelId: 'Produk',
    portofolioLabelEn: 'Products'
  },
  'rattan-export-house-indonesia': {
    nameId: 'Rattan Export House Indonesia',
    nameEn: 'Rattan Export House Indonesia',
    taglineId: 'Menghubungkan produk rotan Indonesia dengan pasar internasional secara profesional.',
    taglineEn: 'Connecting Indonesian rattan products to international markets professionally.',
    descId: 'Agregator ekspor menyeluruh yang mengkhususkan diri pada produk rotan Indonesia, mulai dari bahan baku dan komponen setengah jadi hingga furnitur jadi dan dekorasi rumah.',
    descEn: 'End-to-end export aggregator specializing in Indonesian rattan products, from raw materials and semi-finished components to finished furniture and home décor.',
    wa: '6281239669880',
    industry: 'Rattan Export',
    waMessageId: 'Halo%20Rattan%20Export%20House%20Indonesia%2C%20saya%20tertarik%20untuk%20mengekspor%20produk%20rotan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Rattan%20Export%20House%20Indonesia%2C%20I%20am%20interested%20in%20exporting%20your%20rattan%20products.%20Could%20you%20tell%20me%20more%3F',
    highlights: [
      { titleId: 'Jaringan Global', titleEn: 'Global Network', descId: 'Kami memiliki jaringan pembeli internasional yang luas di berbagai negara di Eropa, Amerika, dan Asia.', descEn: 'We have an extensive international buyer network across Europe, America, and Asia.' },
      { titleId: 'Pengurusan Dokumen Lengkap', titleEn: 'Complete Documentation', descId: 'Kami mengurus seluruh dokumen ekspor mulai dari sertifikasi hingga pengiriman agar proses berjalan lancar.', descEn: 'We handle all export documentation from certification to shipping to ensure smooth processes.' },
      { titleId: 'Jaminan Kualitas', titleEn: 'Quality Assurance', descId: 'Setiap produk melewati proses quality control ketat sebelum diekspor untuk memastikan kepuasan pembeli.', descEn: 'Every product undergoes strict quality control before export to ensure buyer satisfaction.' },
    ],
    services: [
      { titleId: 'Ekspor Furnitur Rotan', titleEn: 'Rattan Furniture Export', descId: 'Ekspor furnitur rotan premium ke pasar internasional dengan standar kualitas tinggi.', descEn: 'Export of premium rattan furniture to international markets with high quality standards.' },
      { titleId: 'Ekspor Kerajinan Rotan', titleEn: 'Rattan Craft Export', descId: 'Ekspor berbagai kerajinan rotan dekoratif ke pembeli ritel dan grosir internasional.', descEn: 'Export of various decorative rattan crafts to international retail and wholesale buyers.' },
      { titleId: 'Konsultasi Ekspor', titleEn: 'Export Consultation', descId: 'Layanan konsultasi untuk pengrajin dan produsen rotan yang ingin memasuki pasar ekspor.', descEn: 'Consultation services for rattan artisans and producers looking to enter the export market.' },
      { titleId: 'Sourcing & Procurement', titleEn: 'Sourcing & Procurement', descId: 'Layanan pengadaan produk rotan sesuai spesifikasi dan kebutuhan pembeli internasional.', descEn: 'Rattan product procurement services according to international buyer specifications and needs.' },
    ],
    portofolioLabelId: 'Produk',
    portofolioLabelEn: 'Products',
  },
  'kriya-kayu-nusantara': {
    nameId: 'Kriya Kayu Nusantara',
    nameEn: 'Kriya Kayu Nusantara',
    taglineId: 'Kerajinan kayu premium berbasis kearifan dan seni budaya Nusantara.',
    taglineEn: 'Premium woodcraft based on the art and wisdom of the Nusantara archipelago.',
    descId: 'Menciptakan produk kayu buatan tangan mulai dari karya seni hingga furnitur custom untuk hotel, restoran, dan proyek komersial. Kami memadukan teknik pertukangan tradisional dengan desain kontemporer.',
    descEn: 'Creating handcrafted wooden products ranging from artisan pieces to custom furniture for hotels, restaurants, and commercial projects. We combine traditional woodworking techniques with contemporary design.',
    wa: '6281239669880',
    industry: 'Woodcraft',
    waMessageId: 'Halo%20Kriya%20Kayu%20Nusantara%2C%20saya%20tertarik%20dengan%20produk%20kerajinan%20kayu%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Kriya%20Kayu%20Nusantara%2C%20I%20am%20interested%20in%20your%20woodcraft%20products.%20Could%20you%20tell%20me%20more%3F',
    highlights: [
      { titleId: 'Handmade & Artisanal', titleEn: 'Handmade & Artisanal', descId: 'Setiap produk dibuat secara handmade oleh pengrajin kayu terampil yang mewarisi keahlian turun-temurun.', descEn: 'Every product is handmade by skilled woodcraft artisans who inherited generations of expertise.' },
      { titleId: 'Kayu Pilihan Berkelanjutan', titleEn: 'Sustainable Selected Wood', descId: 'Kami menggunakan kayu pilihan dari sumber yang bertanggung jawab dan berkelanjutan.', descEn: 'We use selected wood from responsible and sustainable sources.' },
      { titleId: 'Motif Budaya Nusantara', titleEn: 'Nusantara Cultural Motifs', descId: 'Setiap produk mengangkat motif dan nilai seni budaya Nusantara yang kaya dan beragam.', descEn: 'Each product features the rich and diverse cultural art motifs of the Nusantara archipelago.' },
    ],
    services: [
      { titleId: 'Furnitur Kayu Custom', titleEn: 'Custom Wood Furniture', descId: 'Pembuatan furnitur kayu premium sesuai desain dan kebutuhan pelanggan.', descEn: 'Premium wood furniture crafted according to customer design and needs.' },
      { titleId: 'Kerajinan Dekoratif Kayu', titleEn: 'Decorative Wood Crafts', descId: 'Berbagai produk kerajinan kayu dekoratif bermotif budaya Nusantara.', descEn: 'Various decorative wood craft products with Nusantara cultural motifs.' },
      { titleId: 'Ukiran Kayu', titleEn: 'Wood Carving', descId: 'Ukiran kayu artistik untuk dekorasi, souvenir, dan koleksi seni.', descEn: 'Artistic wood carvings for decoration, souvenirs, and art collections.' },
      { titleId: 'Produk Kayu B2B', titleEn: 'B2B Wood Products', descId: 'Penyediaan produk kayu dalam jumlah besar untuk kebutuhan bisnis hotel, restoran, dan properti.', descEn: 'Supply of wood products in bulk for hotel, restaurant, and property business needs.' },
    ],
    portofolioLabelId: 'Produk',
    portofolioLabelEn: 'Products',
  },
  'nada-upacara-bali': {
    nameId: 'Nada Upacara Bali',
    nameEn: 'Nada Upacara Bali',
    taglineId: 'Menyediakan pertunjukan budaya dan layanan upacara adat Bali yang autentik untuk komunitas, industri perhotelan, dan penyelenggara acara.',
    taglineEn: 'Providing authentic Balinese cultural performances and ceremonial services for communities, the hospitality industry, and event organizers.',
    descId: 'Menyediakan pertunjukan budaya dan layanan upacara adat Bali yang autentik bagi komunitas, industri perhotelan, dan penyelenggara acara. Kami berkomitmen melestarikan tradisi hidup Bali.',
    descEn: 'Providing authentic Balinese cultural performances and ceremonial services for communities, the hospitality industry, and event organizers. We are committed to preserving Bali\'s living traditions.',
    wa: '6281239669880',
    industry: 'Cultural & Ceremony',
    waMessageId: 'Halo%20Nada%20Upacara%20Bali%2C%20saya%20tertarik%20dengan%20layanan%20upacara%20adat%20Bali%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Nada%20Upacara%20Bali%2C%20I%20am%20interested%20in%20your%20Balinese%20ceremonial%20services.%20Could%20you%20tell%20me%20more%3F',
    highlights: [
      { titleId: 'Mengikuti Tradisi Leluhur', titleEn: 'Following Ancestral Traditions', descId: 'Setiap produk dibuat mengikuti tata cara dan tradisi upacara Bali yang telah diwariskan turun-temurun.', descEn: 'Every product is made following the procedures and traditions of Balinese ceremonies passed down through generations.' },
      { titleId: 'Dibuat dengan Ketulusan', titleEn: 'Made with Sincerity', descId: 'Kami percaya bahwa perlengkapan upacara harus dibuat dengan ketulusan hati untuk menjaga kesakralan ritual.', descEn: 'We believe ceremonial supplies must be made with sincerity to maintain the sanctity of rituals.' },
      { titleId: 'Lengkap & Terpercaya', titleEn: 'Complete & Trusted', descId: 'Kami menyediakan berbagai kebutuhan upacara secara lengkap sehingga pelanggan tidak perlu mencari ke tempat lain.', descEn: 'We provide complete ceremonial needs so customers don\'t need to look elsewhere.' },
    ],
    services: [
      { titleId: 'Perlengkapan Upacara Adat', titleEn: 'Traditional Ceremony Supplies', descId: 'Penyediaan lengkap perlengkapan untuk berbagai upacara adat Bali seperti odalan, ngaben, dan pernikahan.', descEn: 'Complete supply of materials for various Balinese traditional ceremonies such as odalan, ngaben, and weddings.' },
      { titleId: 'Sesajen & Banten', titleEn: 'Offerings & Banten', descId: 'Pembuatan sesajen dan banten untuk berbagai keperluan ritual keagamaan Hindu Bali.', descEn: 'Making of offerings and banten for various Balinese Hindu religious ritual needs.' },
      { titleId: 'Konsultasi Upacara', titleEn: 'Ceremony Consultation', descId: 'Layanan konsultasi untuk membantu perencanaan dan pelaksanaan upacara adat sesuai tradisi.', descEn: 'Consultation services to help plan and execute traditional ceremonies according to tradition.' },
      { titleId: 'Perlengkapan Tari & Gamelan', titleEn: 'Dance & Gamelan Equipment', descId: 'Penyediaan perlengkapan tari tradisional Bali dan instrumen gamelan untuk keperluan upacara dan pertunjukan.', descEn: 'Supply of traditional Balinese dance equipment and gamelan instruments for ceremonies and performances.' },
    ],
    portofolioLabelId: 'Pertunjukan',
    portofolioLabelEn: 'Performances',
  },
  'bali-menari-academy': {
    nameId: 'Bali Menari Academy',
    nameEn: 'Bali Menari Academy',
    taglineId: 'Kelas tari tradisional dan modern untuk anak-anak maupun dewasa melalui pendekatan Joyful Learning.',
    taglineEn: 'Traditional and modern dance classes for children and adults through a Joyful Learning approach.',
    descId: 'Kami menyelenggarakan kelas tari tradisional dan modern bagi anak-anak maupun dewasa melalui pendekatan Joyful Learning.',
    descEn: 'We provide traditional and modern dance classes for children and adults through a Joyful Learning approach.',
    wa: '6281239669880',
    industry: 'Performing Arts',
    waMessageId: 'Halo%20Bali%20Menari%20Academy%2C%20saya%20tertarik%20dengan%20kelas%20tari%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Bali%20Menari%20Academy%2C%20I%20am%20interested%20in%20your%20dance%20classes.%20Could%20you%20tell%20me%20more%3F',
    highlights: [],
    services: [
      { titleId: 'Workshop Tari Bali', titleEn: 'Balinese Dance Workshop', descId: 'Program workshop tari Bali untuk wisatawan, pelajar, dan pecinta budaya yang ingin belajar tari tradisional.', descEn: 'Balinese dance workshop programs for tourists, students, and culture enthusiasts wanting to learn traditional dance.' },
    ],
    portofolioLabelId: 'Dokumentasi',
    portofolioLabelEn: 'Documentation',
  },
  'niaga-rasa-indonesia': {
    nameId: 'Niaga Rasa Indonesia',
    nameEn: 'Niaga Rasa Indonesia',
    taglineId: 'Perusahaan ekspor yang menghubungkan produk pertanian Indonesia dengan pasar domestik dan internasional.',
    taglineEn: 'An export company connecting Indonesia\'s agricultural products with domestic and international markets.',
    descId: 'Perusahaan ekspor yang menghubungkan produk pertanian Indonesia dengan pasar domestik dan internasional, mempromosikan rempah-rempah dan bahan alami berkualitas tinggi melalui perdagangan yang bertanggung jawab.',
    descEn: 'Export company that connects Indonesia\'s agricultural products with domestic and international markets, promoting high-quality spices and natural ingredients through responsible trade.',
    wa: '6281239669880',
    industry: 'Culinary',
    waMessageId: 'Halo%20Niaga%20Rasa%20Indonesia%2C%20saya%20tertarik%20dengan%20produk%20kuliner%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Niaga%20Rasa%20Indonesia%2C%20I%20am%20interested%20in%20your%20culinary%20products.%20Could%20you%20tell%20me%20more%3F',
    highlights: [
      { titleId: 'Resep Autentik Nusantara', titleEn: 'Authentic Nusantara Recipes', descId: 'Setiap hidangan menggunakan resep autentik yang terinspirasi dari kekayaan kuliner tradisional Nusantara.', descEn: 'Every dish uses authentic recipes inspired by the rich traditional cuisine of the Nusantara archipelago.' },
      { titleId: 'Bahan Lokal Berkualitas', titleEn: 'Quality Local Ingredients', descId: 'Kami menggunakan bahan-bahan lokal pilihan yang segar dan berkualitas tinggi dari sumber terpercaya.', descEn: 'We use selected fresh and high-quality local ingredients from trusted sources.' },
      { titleId: 'Tradisi Bertemu Modernitas', titleEn: 'Tradition Meets Modernity', descId: 'Kami memadukan cita rasa tradisional dengan teknik dan presentasi modern untuk pengalaman kuliner yang unik.', descEn: 'We blend traditional flavors with modern techniques and presentation for a unique culinary experience.' },
    ],
    services: [
      { titleId: 'Katering Acara', titleEn: 'Event Catering', descId: 'Layanan katering untuk berbagai acara mulai dari pernikahan, korporat, hingga acara keluarga.', descEn: 'Catering services for various events from weddings and corporate to family gatherings.' },
      { titleId: 'Produk Kuliner Kemasan', titleEn: 'Packaged Culinary Products', descId: 'Berbagai produk kuliner Nusantara dalam kemasan premium yang siap dijual dan diekspor.', descEn: 'Various Nusantara culinary products in premium packaging ready for sale and export.' },
      { titleId: 'Konsultasi Kuliner', titleEn: 'Culinary Consultation', descId: 'Layanan konsultasi pengembangan menu dan konsep kuliner berbasis cita rasa Nusantara.', descEn: 'Menu development and culinary concept consultation services based on Nusantara flavors.' },
      { titleId: 'Pelatihan Kuliner', titleEn: 'Culinary Training', descId: 'Program pelatihan memasak masakan Nusantara autentik untuk individu dan tim kuliner profesional.', descEn: 'Authentic Nusantara cooking training programs for individuals and professional culinary teams.' },
    ],
    portofolioLabelId: 'Produk',
    portofolioLabelEn: 'Products',
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = companies[slug];

  if (!company) {
    return { title: 'Perusahaan Tidak Ditemukan | Warma Heritage Group' };
  }

  return {
    title: `${company.nameId} | Warma Heritage Group`,
    description: company.taglineId,
    openGraph: {
      title: `${company.nameId} | Warma Heritage Group`,
      description: company.taglineId,
      images: [{ url: '/Logo_clear.png', width: 1200, height: 630 }],
    },
  };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const company = companies[slug];
  if (!company) notFound();
  return <CompanyDetailClient company={company} slug={slug} />;
}