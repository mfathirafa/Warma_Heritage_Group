import { notFound } from 'next/navigation';
import CompanyDetailClient from './CompanyDetailClient';
import type { Metadata } from 'next';
import { COMPANY_SITE } from '../../lib/constants';
import { prisma } from '@/app/lib/prisma';

const companies: Record<string, {
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
    taglineId: 'Mitra furniture dan kerajinan rotan untuk hotel, villa, restoran, dan kafe, dengan solusi produksi custom, material alami maupun sintetis, serta layanan perbaikan furniture.',
    taglineEn: 'Your Partner in Rattan Furniture and Craftsmanship for Hotels, Villas, Restaurants, and Cafés. We provide custom manufacturing, natural and synthetic rattan solutions, and furniture repair services.',
    descId: 'Karya Rotan Indonesia adalah perusahaan yang bergerak di bidang produksi furniture dan kerajinan berbahan rotan untuk memenuhi kebutuhan hotel, villa, restoran, kafe, serta berbagai proyek komersial lainnya. Kami menghadirkan beragam solusi berbasis rotan, mulai dari furniture rotan alami dan sintetis, panel rotan sintetis, hingga kerajinan dekoratif yang dirancang untuk memperkuat karakter dan estetika setiap ruang. Dengan kemampuan produksi berdasarkan kebutuhan pelanggan, kami membantu mewujudkan desain, ukuran, dan spesifikasi produk yang sesuai dengan konsep interior maupun kebutuhan operasional setiap proyek. Didukung oleh keterampilan pengrajin lokal, pilihan material yang beragam, serta layanan perbaikan furniture rotan, Karya Rotan Indonesia berkomitmen menjadi mitra yang dapat diandalkan dalam menciptakan produk yang fungsional, estetis, dan tahan digunakan. Kami percaya bahwa perpaduan antara keahlian kerajinan, fleksibilitas produksi, dan pemahaman terhadap kebutuhan pelanggan dapat menghasilkan solusi yang memberikan nilai jangka panjang.',
    descEn: 'Karya Rotan Indonesia specializes in the production of rattan furniture and crafts, serving hotels, villas, restaurants, cafés, and a wide range of commercial projects. We offer a diverse range of rattan solutions, from natural and synthetic rattan furniture to synthetic rattan panels and decorative crafts designed to enhance the character and aesthetics of any space. Through our custom manufacturing capabilities, we help bring our clients\' ideas to life with products tailored to their preferred designs, dimensions, and project specifications. Supported by the craftsmanship of local Indonesian artisans, a versatile selection of materials, and dedicated rattan furniture repair services, Karya Rotan Indonesia strives to be a reliable partner in creating products that combine functionality, aesthetics, and durability. We believe that the combination of skilled craftsmanship, production flexibility, and an understanding of our clients\' needs allows us to deliver solutions that create lasting value.',
    wa: '6281239669880',
    industry: 'Rattan Furniture & Crafts',
    waMessageId: 'Halo%20Karya%20Rotan%20Indonesia%2C%20saya%20tertarik%20dengan%20produk%20rotan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Karya%20Rotan%20Indonesia%2C%20I%20am%20interested%20in%20your%20rattan%20products.%20Could%20you%20tell%20me%20more%3F',
    highlights: [
      { titleId: '100% Pengrajin Lokal', titleEn: '100% Local Artisans', descId: 'Kami mengandalkan keterampilan pengrajin lokal Indonesia untuk menghasilkan furniture dan kerajinan rotan dengan perhatian pada detail, kualitas pengerjaan, dan karakter material.', descEn: 'We work with skilled Indonesian artisans to produce rattan furniture and crafts with attention to detail, workmanship, and the unique character of each material.' },
      { titleId: 'Pilihan Material Fleksibel', titleEn: 'Flexible Material Options', descId: 'Dari rotan alami hingga rotan sintetis, kami menyediakan pilihan material yang dapat disesuaikan dengan desain, fungsi, dan kebutuhan penggunaan setiap proyek.', descEn: 'From natural rattan to synthetic alternatives, we offer a variety of materials to suit the design, function, and practical requirements of every project.' },
      { titleId: 'Solusi Sesuai Kebutuhan', titleEn: 'Tailored Solutions', descId: 'Kami melayani pembuatan furniture dan kerajinan berdasarkan desain, ukuran, serta spesifikasi proyek, sekaligus menyediakan layanan perbaikan furniture rotan.', descEn: 'We provide custom furniture and craft manufacturing based on your designs, dimensions, and project specifications, alongside professional rattan furniture repair services.' },
    ],
    services: [
      { titleId: 'Furniture Rotan', titleEn: 'Rattan Furniture', descId: 'Furniture berbahan rotan alami maupun sintetis untuk melengkapi area indoor dan outdoor, termasuk kebutuhan hotel, villa, restoran, dan kafe.', descEn: 'Natural and synthetic rattan furniture designed for indoor and outdoor spaces, serving the needs of hotels, villas, restaurants, cafés, and other commercial environments.' },
      { titleId: 'Panel Rotan Sintetis', titleEn: 'Synthetic Rattan Panels', descId: 'Panel anyaman rotan sintetis untuk kebutuhan fasad, plafon, pilar, partisi, dan elemen interior. Tersedia sebagai solusi material untuk kebutuhan produksi maupun desain khusus.', descEn: 'Synthetic rattan woven panels for façades, ceilings, columns, partitions, and other interior applications. Available for custom manufacturing and tailored design requirements.' },
      { titleId: 'Kerajinan Dekoratif', titleEn: 'Decorative Crafts', descId: 'Beragam produk kerajinan rotan untuk memperkaya karakter ruang, mulai dari elemen dekorasi hingga aksesori interior yang mendukung konsep desain hospitality.', descEn: 'A variety of rattan crafts that bring character and texture to any space, from decorative elements to interior accessories that complement hospitality and commercial design concepts.' },
      { titleId: 'Perbaikan Furniture Rotan', titleEn: 'Rattan Furniture Repair', descId: 'Layanan perbaikan dan pemulihan furniture rotan untuk membantu memperpanjang masa pakai produk serta menjaga fungsi dan tampilannya.', descEn: 'Furniture repair and restoration services designed to extend product lifespan while preserving functionality, appearance, and usability.' },
    ],
    portofolioLabelId: 'Produk',
    portofolioLabelEn: 'Products',
  },
  'rattan-export-house-indonesia': {
    nameId: 'Rattan Export House Indonesia',
    nameEn: 'Rattan Export House Indonesia',
    taglineId: 'Agregator ekspor produk rotan Indonesia, menghubungkan pembeli global dengan pengrajin lokal dan mitra produsen terpercaya.',
    taglineEn: 'Export aggregator specializing in Indonesian rattan products, connecting global buyers with trusted local artisans and manufacturing partners.',
    descId: 'Rattan Export House Indonesia (REHI) adalah agregator ekspor yang mengkhususkan diri pada produk rotan Indonesia, menghubungkan pembeli global dengan produk rotan berkualitas melalui jaringan pengrajin lokal dan mitra produsen terpercaya. Kami menyediakan beragam produk yang mencakup seluruh rantai pasok industri rotan, mulai dari bahan baku dan komponen setengah jadi hingga furnitur jadi dan dekorasi rumah. Melalui layanan terintegrasi yang meliputi pemilihan produk, pengendalian kualitas, konsolidasi pesanan, dokumentasi ekspor, hingga koordinasi logistik, REHI membantu pembeli internasional memperoleh produk rotan Indonesia dengan proses pengadaan yang lebih efisien dan andal. Dengan mengutamakan kualitas, pengadaan yang bertanggung jawab, dan kemitraan jangka panjang, REHI menjembatani industri rotan Indonesia dengan pasar global. Kami berkomitmen membuka peluang bagi pengrajin dan produsen lokal sekaligus menghadirkan solusi ekspor yang terpercaya bagi pembeli di berbagai negara.',
    descEn: 'Rattan Export House Indonesia (REHI) is an export aggregator specializing in Indonesian rattan products, connecting global buyers with Indonesia’s finest rattan products through a network of trusted local artisans and manufacturing partners. Our product range covers the entire rattan supply chain, from raw materials and semi-finished components to finished furniture and home décor. We simplify the sourcing process by coordinating product selection, quality control, order consolidation, export documentation, and logistics to help international buyers source Indonesian rattan products more efficiently and reliably. With a commitment to quality, responsible sourcing, and long-term partnerships, REHI bridges the gap between Indonesia’s rattan industry and global markets, creating opportunities for local producers while delivering dependable export solutions to buyers worldwide.',
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
    taglineId: 'Mitra produksi furniture dan kerajinan kayu untuk hotel, villa, restoran, dan kafe, dengan layanan custom tanpa minimum order serta solusi produk kayu untuk berbagai kebutuhan bisnis.',
    taglineEn: 'Your Custom Woodworking Partner for Hotels, Villas, Restaurants, and Cafés. We provide made-to-order furniture, wooden crafts, and tailored wood product solutions with no minimum order quantity.',
    descId: 'Kriya Kayu Nusantara adalah perusahaan yang bergerak di bidang produksi furniture dan kerajinan berbahan kayu, melayani kebutuhan hotel, villa, restoran, kafe, desainer interior, serta berbagai proyek komersial lainnya. Kami menghadirkan beragam solusi produk kayu, mulai dari furniture custom, kerajinan dekoratif, panel kayu, hingga berbagai produk pendukung operasional bisnis seperti amenities dan perlengkapan hospitality. Dengan fleksibilitas produksi berdasarkan desain, ukuran, material, dan spesifikasi pelanggan, kami membantu mewujudkan berbagai kebutuhan produk kayu, baik untuk melengkapi interior maupun mendukung identitas dan kebutuhan operasional suatu bisnis. Kriya Kayu Nusantara menawarkan fleksibilitas pemesanan tanpa minimum order quantity (MOQ), sehingga pelanggan dapat memesan produk sesuai kebutuhan, mulai dari satuan hingga pesanan dalam jumlah besar. Didukung oleh keterampilan pengrajin lokal Indonesia, kami berkomitmen menghadirkan produk yang fungsional, estetis, dan sesuai dengan kebutuhan setiap pelanggan. Kami percaya bahwa perpaduan antara kreativitas, keahlian pengerjaan, dan fleksibilitas produksi dapat menciptakan solusi kayu yang memberikan nilai tambah bagi setiap bisnis.',
    descEn: 'Kriya Kayu Nusantara specializes in the production of wooden furniture and crafts, serving hotels, villas, restaurants, cafés, interior designers, and a wide range of commercial projects. We offer a diverse range of wooden products, from custom furniture and decorative crafts to wood panels and business essentials such as hospitality amenities and accessories. With flexible manufacturing capabilities tailored to our clients\' designs, dimensions, materials, and specifications, we help bring ideas to life through customized wooden products that complement interior concepts and support business operations. Kriya Kayu Nusantara offers the flexibility of no minimum order quantity (MOQ), allowing clients to order according to their specific needs, from individual pieces to large-scale production runs. Supported by the skills and craftsmanship of local Indonesian artisans, we are committed to delivering products that are functional, aesthetically pleasing, and tailored to each client\'s requirements. We believe that combining creativity, skilled craftsmanship, and flexible production creates meaningful value for every business we serve.',
    wa: '6281239669880',
    industry: 'Woodcraft & Custom Furniture',
    waMessageId: 'Halo%20Kriya%20Kayu%20Nusantara%2C%20saya%20tertarik%20dengan%20produk%20kerajinan%20kayu%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Kriya%20Kayu%20Nusantara%2C%20I%20am%20interested%20in%20your%20woodcraft%20products.%20Could%20you%20tell%20me%20more%3F',
    highlights: [
      { titleId: 'Tanpa Minimum Order', titleEn: 'No Minimum Order', descId: 'Kami menerima pesanan tanpa minimum order quantity (MOQ), memberikan fleksibilitas bagi pelanggan untuk memesan produk sesuai kebutuhan, baik dalam jumlah satuan, skala kecil, maupun proyek berskala besar.', descEn: 'We accept orders without a minimum order quantity (MOQ), giving clients the flexibility to purchase according to their needs, whether for individual pieces, small batches, or large-scale projects.' },
      { titleId: 'Custom Sesuai Kebutuhan', titleEn: 'Custom-Made Solutions', descId: 'Kami melayani pembuatan furniture dan kerajinan kayu berdasarkan desain, ukuran, material, dan spesifikasi pelanggan untuk mewujudkan kebutuhan produk yang lebih personal dan sesuai dengan konsep setiap proyek.', descEn: 'We produce wooden furniture and crafts based on your preferred designs, dimensions, materials, and specifications, helping bring your ideas to life while meeting the unique requirements of each project.' },
      { titleId: 'Memberdayakan Pengrajin Lokal', titleEn: 'Empowering Local Artisans', descId: 'Kami bekerja sama dengan pengrajin lokal Indonesia untuk mendukung keterampilan kerajinan kayu, membuka peluang ekonomi, dan menghadirkan produk dengan karakter serta kualitas pengerjaan yang khas.', descEn: 'We collaborate with local Indonesian artisans to support traditional woodworking skills, create economic opportunities, and deliver products that reflect distinctive craftsmanship and attention to detail.' },
    ],
    services: [
      { titleId: 'Furniture Kayu Custom', titleEn: 'Custom Wooden Furniture', descId: 'Produksi furniture kayu berdasarkan desain dan spesifikasi pelanggan untuk kebutuhan hotel, villa, restoran, kafe, hunian, dan berbagai proyek komersial, baik untuk area indoor maupun outdoor sesuai kesesuaian material.', descEn: 'Made-to-order wooden furniture tailored to your designs and specifications for hotels, villas, restaurants, cafés, residential spaces, and commercial projects. Suitable for indoor and outdoor applications, depending on material selection and product requirements.' },
      { titleId: 'Kerajinan Dekoratif Kayu', titleEn: 'Decorative Wooden Crafts', descId: 'Beragam produk kerajinan kayu yang dirancang untuk memperkuat karakter dan estetika ruang, mulai dari aksesori interior, ornamen dekoratif, hingga produk custom yang mendukung konsep desain pelanggan.', descEn: 'A diverse range of wooden crafts designed to enhance the character and aesthetics of any space, including interior accessories, decorative ornaments, and custom-made pieces that complement your design concept.' },
      { titleId: 'Panel dan Elemen Interior Kayu', titleEn: 'Wood Panels & Interior Elements', descId: 'Berbagai panel kayu dan elemen dekoratif untuk kebutuhan interior, termasuk pelapis dinding, partisi, aksen dekoratif, serta komponen custom yang disesuaikan dengan kebutuhan desain dan spesifikasi proyek.', descEn: 'Wood panels and decorative elements for interior applications, including wall cladding, partitions, decorative accents, and custom components tailored to specific design concepts and project requirements.' },
      { titleId: 'Produk Kayu untuk Kebutuhan B2B', titleEn: 'Custom Wooden Products for Businesses', descId: 'Produksi berbagai produk kayu untuk mendukung kebutuhan operasional dan identitas bisnis, seperti amenities hotel, kotak penyimpanan, nampan, tempat tisu, display produk, perlengkapan restoran, dan berbagai produk custom lainnya untuk sektor hospitality maupun bisnis komersial.', descEn: 'A variety of wooden products designed to support business operations and brand identity, including hotel amenities, storage boxes, serving trays, tissue box holders, product displays, restaurant accessories, and other customized products for the hospitality and commercial sectors.' },
    ],
    portofolioLabelId: 'Produk',
    portofolioLabelEn: 'Products',
  },
  'nada-upacara-bali': {
    nameId: 'Nada Upacara Bali',
    nameEn: 'Nada Upacara Bali',
    taglineId: 'Menghadirkan keindahan seni Bali melalui pertunjukan autentik, pengalaman budaya, dan pelayanan profesional.',
    taglineEn: 'Bringing the beauty of Balinese arts to life through authentic performances, cultural experiences, and professional service.',
    descId: 'Nada Upacara Bali adalah penyedia layanan pertunjukan seni tradisional Bali yang melayani kebutuhan hotel, villa, pernikahan, acara korporat, dan MICE. Kami menghadirkan beragam pertunjukan, mulai dari musik tradisional seperti Rindik, Gamelan Semarandana, dan Selonding hingga tari tradisional, tari kontemporer, serta pertunjukan khusus yang dapat disesuaikan dengan konsep acara. Selain pertunjukan, kami menyediakan pengalaman budaya interaktif seperti kelas tari Bali, Kecak, suling bambu, dan Rindik. Dengan pemahaman budaya yang kuat serta standar pelayanan profesional, kami menjadi mitra terpadu untuk kebutuhan pertunjukan dan pengalaman budaya Bali.',
    descEn: 'Nada Upacara Bali is a Balinese traditional performing arts provider serving hotels, villas, weddings, corporate events, and MICE (Meetings, Incentives, Conferences, and Exhibitions). We offer a diverse range of performances, from traditional music such as Rindik, Gamelan Semarandana, and Selonding to traditional and contemporary dance, as well as bespoke performances tailored to each event\'s concept and requirements. Beyond performances, we also offer interactive cultural experiences, including Balinese dance, Kecak, bamboo flute, and Rindik workshops. Combining a deep understanding of Balinese culture with professional service standards, we serve as a comprehensive partner for performance and cultural experience needs.',
    wa: '6281239669880',
    industry: 'Cultural & Performing Arts',
    waMessageId: 'Halo%20Nada%20Upacara%20Bali%2C%20saya%20tertarik%20dengan%20layanan%20pertunjukan%20seni%20Bali%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Nada%20Upacara%20Bali%2C%20I%20am%20interested%20in%20your%20Balinese%20cultural%20performances.%20Could%20you%20tell%20me%20more%3F',
    highlights: [
      { titleId: 'Seniman Praktisi Kebudayaan', titleEn: 'Cultural Arts Practitioners', descId: 'Kami adalah praktisi seni yang memahami tradisi, nilai, dan karakter seni pertunjukan Bali. Setiap pertunjukan dirancang dengan menghormati akar budaya sekaligus menyesuaikan penyajiannya dengan konteks acara dan audiens.', descEn: 'We are arts practitioners with a deep understanding of the traditions, values, and unique characteristics of Balinese performing arts. Every performance is developed with respect for its cultural roots while adapting its presentation to suit the event\'s context and audience.' },
      { titleId: 'Standar Pertunjukan Profesional', titleEn: 'Professional Performance Standards', descId: 'Kami menggabungkan keahlian artistik dengan standar profesional dalam penampilan, kostum, tata penyajian, koordinasi, dan pelaksanaan acara. Kami memahami bahwa pertunjukan yang baik tidak hanya harus indah, tetapi juga tepat waktu, terorganisasi, dan sesuai dengan ekspektasi klien.', descEn: 'We combine artistic expertise with professional standards in presentation, costumes, stage arrangements, coordination, and event execution. We understand that an exceptional performance must not only be visually captivating but also punctual, well-organized, and aligned with our clients\' expectations.' },
      { titleId: 'Penyedia Solusi Lengkap', titleEn: 'Comprehensive Arts & Entertainment Solutions', descId: 'Dari musik tradisional dan tari-tarian hingga kelas seni dan pengalaman budaya interaktif, kami menyediakan berbagai layanan dalam satu mitra. Hal ini memudahkan klien merencanakan kebutuhan seni dan budaya untuk berbagai jenis acara.', descEn: 'From traditional music and dance performances to art classes and interactive cultural experiences, we provide a wide range of services through one trusted partner. This allows clients to plan their arts and cultural entertainment needs more efficiently for various types of events.' },
    ],
    services: [
      { titleId: 'Traditional & Contemporary Balinese Dance', titleEn: 'Traditional & Contemporary Balinese Dance', descId: 'Pertunjukan tari tradisional dan kontemporer Bali untuk berbagai kebutuhan acara, termasuk tari pembukaan, tari penyambutan, hiburan panggung, Joged Bumbung, tari api, hingga pertunjukan kolosal yang dikembangkan secara khusus sesuai konsep dan kebutuhan acara.', descEn: 'Traditional and contemporary Balinese dance performances for a wide range of occasions, including opening ceremonies, welcoming performances, stage entertainment, Joged Bumbung, fire dance, and large-scale productions specially developed to match each event\'s concept and requirements.' },
      { titleId: 'Balinese Gamelan & Rindik Performances', titleEn: 'Balinese Gamelan & Rindik Performances', descId: 'Pertunjukan musik tradisional Bali untuk menciptakan suasana yang autentik dan berkarakter. Pilihan meliputi Rindik, Gamelan Semarandana, Gamelan Selonding, serta berbagai format ansambel musik tradisional yang sesuai untuk hotel, villa, restoran, pernikahan, dan acara korporat.', descEn: 'Traditional Balinese music performances that create an authentic atmosphere and distinctive cultural character. Our offerings include Rindik, Gamelan Semarandana, Gamelan Selonding, and various traditional musical ensemble formats suitable for hotels, villas, restaurants, weddings, and corporate events.' },
      { titleId: 'Balinese Ambience & Event Entertainment', titleEn: 'Balinese Ambience & Event Entertainment', descId: 'Layanan pertunjukan dan hiburan bernuansa Bali yang dirancang untuk melengkapi pengalaman tamu dan memperkuat identitas acara. Mulai dari alunan musik penyambutan hingga rangkaian pertunjukan untuk gala dinner, pernikahan, acara perusahaan, dan MICE, setiap program dapat disesuaikan dengan tema serta kebutuhan penyelenggara.', descEn: 'Balinese-themed performances and entertainment designed to enrich guest experiences and strengthen an event\'s identity. From welcoming music that sets the tone upon arrival to curated performance programs for gala dinners, weddings, corporate functions, and MICE events, every program can be tailored to the event\'s theme and the organizer\'s requirements.' },
      { titleId: 'Balinese Cultural Experiences & Workshops', titleEn: 'Balinese Cultural Experiences & Workshops', descId: 'Program pengalaman budaya interaktif yang mengajak peserta mengenal dan mencoba seni Bali secara langsung. Kegiatan meliputi kelas tari Bali, kelas Kecak, kelas suling bambu, kelas rindik, serta berbagai lokakarya seni dan budaya yang dirancang untuk wisatawan, kelompok perusahaan, sekolah, dan kegiatan edukatif.', descEn: 'Interactive cultural programs that invite participants to discover and experience Balinese arts firsthand. Activities include Balinese dance classes, Kecak workshops, bamboo flute classes, Rindik workshops, and various arts and cultural workshops designed for tourists, corporate groups, schools, and educational programs.' },
    ],
    portofolioLabelId: 'Pertunjukan',
    portofolioLabelEn: 'Performances',
  },
  'bali-menari-academy': {
    nameId: 'Bali Menari Academy',
    nameEn: 'Bali Menari Academy',
    taglineId: 'Tempat les tari anak dengan pilihan kelas tari tradisional dan modern dance, yang menumbuhkan kepercayaan diri melalui gerakan.',
    taglineEn: 'A dance school for children offering traditional Balinese dance and modern dance classes, growing confidence through movement.',
    descId: 'Bali Menari Academy adalah tempat les tari untuk anak usia PAUD hingga SMA yang menghadirkan kelas tari tradisional Bali dan modern dance dalam lingkungan belajar yang menyenangkan, inklusif, dan mendukung perkembangan anak. Melalui pendekatan joyful learning, pengajar yang ramah anak, serta kelas berkapasitas maksimal 15 peserta, kami membantu anak merasa nyaman untuk mencoba, berekspresi, dan menikmati setiap proses belajar menari. Bagi kami, menari bukan hanya tentang menguasai gerakan, tetapi juga tentang membangun rasa percaya diri, keberanian tampil, kemampuan bersosialisasi, dan kebebasan mengekspresikan diri. Dengan tim yang multikultural dan lingkungan yang terbuka bagi anak dari berbagai latar belakang, Bali Menari Academy percaya bahwa setiap anak memiliki potensi untuk berkembang melalui gerakan. Growing Confidence Through Movement.',
    descEn: 'Bali Menari Academy is a dance school for children from preschool through senior high school, offering traditional Balinese dance and modern dance classes in a fun, inclusive, and supportive learning environment. Through our joyful learning approach, child-friendly instructors, and small classes of up to 15 students, we help children feel comfortable exploring movement, expressing themselves, and enjoying every step of their dance journey. For us, dance is about more than mastering movements. It is also a way to build confidence, develop stage presence, encourage self-expression, and strengthen social skills. With a multicultural team and an inclusive environment that welcomes children from all backgrounds, Bali Menari Academy believes every child has the potential to grow through movement. Growing Confidence Through Movement.',
    wa: '6281239669880',
    industry: 'Performing Arts & Dance School',
    waMessageId: 'Halo%20Bali%20Menari%20Academy%2C%20saya%20tertarik%20dengan%20kelas%20tari%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Bali%20Menari%20Academy%2C%20I%20am%20interested%20in%20your%20dance%20classes.%20Could%20you%20tell%20me%20more%3F',
    highlights: [
      { titleId: 'Joyful Learning', titleEn: 'Joyful Learning', descId: 'Kami menghadirkan proses belajar menari yang menyenangkan, interaktif, dan sesuai dengan tahap perkembangan anak, sehingga mereka dapat belajar sambil bermain dan bereksplorasi.', descEn: 'We make learning to dance fun, interactive, and appropriate for each child\'s developmental stage, allowing them to learn, play, and explore through movement.' },
      { titleId: 'Fokus Kelas Kecil', titleEn: 'Small Class Focus', descId: 'Dengan maksimal 15 anak per kelas, pengajar dapat memberikan perhatian yang lebih personal dan mendukung perkembangan setiap anak sesuai dengan kemampuan serta kebutuhannya.', descEn: 'With a maximum of 15 students per class, our instructors can provide more personalized attention and support each child\'s progress according to their individual abilities and needs.' },
      { titleId: 'Pengajar Ramah Anak', titleEn: 'Child-Friendly Instructors', descId: 'Pengajar kami menciptakan lingkungan belajar yang ramah, suportif, dan bebas dari rasa takut untuk mencoba, sehingga anak merasa aman untuk belajar dan berkembang.', descEn: 'Our instructors create a welcoming, supportive, and encouraging environment where children feel safe to try new things, make mistakes, and grow with confidence.' },
    ],
    services: [
      { titleId: 'Move & Dance – Early Childhood Dance Class', titleEn: 'Move & Dance – Early Childhood Dance Class', descId: 'Kelas untuk anak usia PAUD hingga TK yang mengenalkan gerakan dasar menari melalui permainan, musik, dan aktivitas menyenangkan untuk mengembangkan koordinasi tubuh dan motorik.', descEn: 'Designed for preschool and kindergarten children, introducing basic dance movements through games, music, and enjoyable activities to develop coordination and confidence.' },
      { titleId: 'Modern Dance Class', titleEn: 'Modern Dance Class', descId: 'Kelas untuk anak usia SD yang mempelajari teknik dasar modern dance (hip-hop, K-pop) untuk mengembangkan koordinasi, musikalitas, dan kreativitas melalui gerakan.', descEn: 'Designed for elementary school children, introducing foundational modern dance techniques to develop coordination, musicality, creativity, and confidence through movement.' },
      { titleId: 'K-Pop Dance Class', titleEn: 'K-Pop Dance Class', descId: 'Kelas untuk anak usia SMP hingga SMA yang ingin mendalami K-pop dance, koreografi, ketepatan gerakan, ekspresi, dan kekompakan tim.', descEn: 'Designed for junior and senior high school students to explore K-pop dance, choreography, movement precision, stage expression, and group synchronization.' },
      { titleId: 'Kelas Tari Tradisional Bali', titleEn: 'Balinese Traditional Dance Class', descId: 'Kelas untuk anak usia SD yang ingin mengenal dan mempelajari teknik dasar, sikap tubuh, ekspresi, serta gerakan seni tari tradisional Bali.', descEn: 'Designed for elementary school children interested in learning fundamental techniques, posture, expression, and movements of traditional Balinese dance.' },
      { titleId: 'Kelas Menari dengan Hati', titleEn: 'Dancing with Heart – Inclusive Class', descId: 'Kelas tari Bali inklusif yang dirancang khusus untuk anak dengan hambatan pendengaran dalam lingkungan yang suportif dan memperhatikan kebutuhan komunikasi anak.', descEn: 'An inclusive Balinese dance class specially designed for children who are deaf or hard of hearing in a supportive, accommodating, and inclusive environment.' },
    ],
    portofolioLabelId: 'Dokumentasi',
    portofolioLabelEn: 'Documentation',
  },
  'niaga-rasa-indonesia': {
    nameId: 'Niaga Rasa Indonesia',
    nameEn: 'Niaga Rasa Indonesia',
    taglineId: 'Mitra Sourcing dan Ekspor Terpadu yang Menghubungkan Produk Unggulan Indonesia dengan Pasar Global.',
    taglineEn: 'Your Integrated Sourcing and Export Partner, Connecting Indonesia\'s Finest Products with Global Markets.',
    descId: 'Niaga Rasa Indonesia adalah perusahaan sourcing dan perdagangan ekspor yang menghubungkan produk-produk unggulan Indonesia, mulai dari hasil pertanian dan komoditas hingga produk konsumen siap jual (FMCG), dengan pasar internasional. Sebagai mitra sourcing dan trading agent, kami membantu pembeli global menemukan pemasok yang tepat, mengoordinasikan pengadaan produk, serta mendukung proses konsolidasi dan ekspor. Dengan pemahaman terhadap pasar lokal dan jaringan pemasok Indonesia, kami menghadirkan solusi pengadaan yang profesional, transparan, dan terintegrasi.',
    descEn: 'Niaga Rasa Indonesia is a sourcing and export trading company connecting Indonesia\'s diverse products, from agricultural commodities and raw materials to ready-to-market consumer goods (FMCG), with international markets. As a sourcing and trading partner, we help global buyers identify reliable suppliers, coordinate product procurement, and facilitate product consolidation and export processes. With our understanding of the local market and network of Indonesian suppliers, we provide professional, transparent, and integrated sourcing solutions.',
    wa: '6281239669880',
    industry: 'Sourcing & Export Trading',
    waMessageId: 'Halo%20Niaga%20Rasa%20Indonesia%2C%20saya%20tertarik%20dengan%20layanan%20sourcing%20dan%20ekspor%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    waMessageEn: 'Hello%20Niaga%20Rasa%20Indonesia%2C%20I%20am%20interested%20in%20your%20sourcing%20and%20export%20services.%20Could%20you%20tell%20me%20more%3F',
    highlights: [
      { titleId: 'Mitra Lokal yang Terpercaya', titleEn: 'Trusted Local Partner', descId: 'Sebagai mitra yang berakar di Indonesia, kami memahami karakter pasar lokal, jaringan pemasok, dan dinamika pengadaan untuk membantu pembeli menemukan mitra yang tepat.', descEn: 'As a locally rooted partner, we understand Indonesia\'s market, supplier networks, and procurement landscape to connect buyers with suitable suppliers.' },
      { titleId: 'Sourcing yang Transparan', titleEn: 'Transparent Sourcing', descId: 'Kami mengutamakan keterbukaan informasi produk, asal pemasok, spesifikasi, dan kebutuhan dokumentasi agar pembeli dapat mengambil keputusan dengan lebih percaya diri.', descEn: 'We prioritize transparency throughout the sourcing process, providing product, supplier, and documentation info to support confident purchasing decisions.' },
      { titleId: 'Layanan Terintegrasi & Profesional', titleEn: 'Integrated & Professional Services', descId: 'Kami mengoordinasikan berbagai tahapan sourcing dan perdagangan melalui satu mitra, mulai dari pencarian pemasok hingga konsolidasi dan koordinasi ekspor.', descEn: 'We coordinate multiple stages of sourcing and export trading through one partner, from supplier identification to product consolidation and export coordination.' },
    ],
    services: [
      { titleId: 'Pengadaan Produk Indonesia', titleEn: 'Indonesian Product Sourcing', descId: 'Membantu pembeli internasional memperoleh berbagai produk Indonesia, mulai dari hasil pertanian, komoditas, bahan baku, hingga produk konsumen siap jual (FMCG).', descEn: 'Helping international buyers source a wide range of Indonesian products, from agricultural commodities and raw materials to ready-to-market consumer goods (FMCG).' },
      { titleId: 'Product Sourcing & Seleksi Pemasok', titleEn: 'Product Sourcing & Supplier Identification', descId: 'Layanan pencarian dan evaluasi pemasok terpercaya berdasarkan kategori produk, spesifikasi, target harga, dan kebutuhan volume pembeli.', descEn: 'Identifying and evaluating reliable suppliers based on product categories, specifications, target prices, order volumes, and buyer requirements.' },
      { titleId: 'Agregasi dan Konsolidasi Produk', titleEn: 'Product Aggregation & Consolidation', descId: 'Mengoordinasikan pengadaan dari berbagai pemasok dan konsolidasi produk untuk menyederhanakan proses pemesanan dan pengiriman ekspor.', descEn: 'Coordinating procurement from multiple suppliers and consolidating products according to order requirements and export shipment needs.' },
      { titleId: 'Export Trading & Coordination', titleEn: 'Export Trading & Coordination', descId: 'Mendukung perdagangan internasional melalui koordinasi dengan pemasok, penyiapan dokumen ekspor, serta pengaturan logistik dan pengiriman.', descEn: 'Supporting international trade through supplier coordination, export documentation preparation, and logistics and shipment arrangements.' },
    ],
    portofolioLabelId: 'Produk & Komoditas',
    portofolioLabelEn: 'Products & Commodities',
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

  const imageUrl = `/images/companies/${slug}.png`;

  return {
    title: `${company.nameId} | Warma Heritage Group`,
    description: company.taglineId,
    alternates: {
      canonical: `/companies/${slug}`,
    },
    openGraph: {
      title: `${company.nameId} | Warma Heritage Group`,
      description: company.taglineId,
      url: `/companies/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: company.nameId,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${company.nameId} | Warma Heritage Group`,
      description: company.taglineId,
      images: [imageUrl],
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const company = companies[slug];
  if (!company) notFound();

  let photos: Array<{
    id: number;
    imageUrl: string;
    titleId: string | null;
    titleEn: string | null;
  }> = [];

  try {
    photos = await prisma.companyPhoto.findMany({
      where: {
        companySlug: slug,
        published: true,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        imageUrl: true,
        titleId: true,
        titleEn: true,
      },
    });
  } catch (error) {
    console.error(`[CompanyDetailPage] Error fetching photos for ${slug}:`, error);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || COMPANY_SITE;

  const companySchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.nameId,
    description: company.descId,
    url: `${siteUrl}/companies/${slug}`,
    image: `${siteUrl}/images/companies/${slug}.png`,
    parentOrganization: {
      '@type': 'Organization',
      name: 'Warma Heritage Group',
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companySchema) }}
      />
      <CompanyDetailClient company={company} slug={slug} photos={photos} />
    </>
  );
}