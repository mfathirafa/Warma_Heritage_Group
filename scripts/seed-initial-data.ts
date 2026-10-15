import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding initial Social Impact programs & Blog posts...');

  // 1. Social Impacts
  const impacts = [
    {
      titleId: 'Pemberdayaan Pengrajin Lokal',
      titleEn: 'Local Artisan Empowerment',
      descId: 'Mendukung dan memberdayakan pengrajin rotan dan kayu lokal untuk menghasilkan produk berkualitas tinggi yang berdaya saing global.',
      descEn: 'Supporting and empowering local rattan and wood artisans to produce high-quality products with global competitiveness.',
      categoryId: 'Komunitas',
      categoryEn: 'Community',
      coverImage: '/images/social/pemberdayaan-pengrajin-lokal.jpg',
      order: 1,
    },
    {
      titleId: 'Pelestarian Seni Bali',
      titleEn: 'Preservation of Balinese Arts',
      descId: 'Menjaga kelestarian seni gamelan, upacara adat, dan tarian sakral Bali melalui edukasi dan pelibatan generasi muda.',
      descEn: 'Preserving the heritage of Balinese gamelan, ceremonial rituals, and sacred dances through youth education.',
      categoryId: 'Budaya',
      categoryEn: 'Culture',
      coverImage: '/images/social/pelestarian-seni-bali.jpg',
      order: 2,
    },
    {
      titleId: 'Pemberdayaan Seniman Muda',
      titleEn: 'Empowering Young Artists',
      descId: 'Memberikan panggung, ruang kreasi, dan fasilitas bagi talenta seni muda Bali untuk terus berkarya dan berinovasi.',
      descEn: 'Providing platforms, creative spaces, and facilities for young Balinese art talents to innovate and flourish.',
      categoryId: 'Pendidikan',
      categoryEn: 'Education',
      coverImage: '/images/social/pemberdayaan-seniman-muda.jpg',
      order: 3,
    },
    {
      titleId: 'Pelatihan Wirausaha bagi Komunitas Lokal',
      titleEn: 'Entrepreneurship Training for Local Communities',
      descId: 'Pelatihan bisnis mandiri, manajemen keuangan sederhana, dan pemasaran digital bagi pelaku UMKM di sekitar wilayah operasional.',
      descEn: 'Self-reliance business training, financial basics, and digital marketing workshops for local SMEs.',
      categoryId: 'Ekonomi',
      categoryEn: 'Economy',
      coverImage: '/images/social/pelatihan-wirausaha-komunitas-lokal.jpg',
      order: 4,
    },
    {
      titleId: 'Mentorship Mahasiswa Bali melalui Program Internship',
      titleEn: 'Mentoring Balinese Students through Internship',
      descId: 'Membuka kesempatan magang praktis di lini bisnis ekspor dan hospitality untuk mencetak profesional muda yang berkarakter.',
      descEn: 'Opening practical internship opportunities in export and hospitality business units to nurture young professionals.',
      categoryId: 'Pendidikan',
      categoryEn: 'Education',
      coverImage: '/images/social/mentorship-mahasiswa-internship.jpg',
      order: 5,
    },
    {
      titleId: 'Berbagi Keceriaan di Panti Asuhan',
      titleEn: 'Sharing Joy at the Orphanage',
      descId: 'Kunjungan rutin, bantuan logistik, perlengkapan sekolah, dan aktivitas rekreatif bersama anak-anak di berbagai panti asuhan di Bali.',
      descEn: 'Regular visits, educational supplies, logistics assistance, and recreational activities with children in Bali orphanages.',
      categoryId: 'Sosial',
      categoryEn: 'Social',
      coverImage: '/images/social/berbagi-keceriaan-panti-asuhan.jpg',
      order: 6,
    },
    {
      titleId: 'Pemeriksaan Kesehatan bagi Lansia di Panti Jompo',
      titleEn: 'Health Checkups for the Elderly',
      descId: 'Layanan pemeriksaan kesehatan berkala, penyuluhan gizi, dan bantuan vitamin bagi para lansia.',
      descEn: 'Periodic medical check-ups, nutritional guidance, and healthcare support for the elderly in nursing homes.',
      categoryId: 'Kesehatan',
      categoryEn: 'Health',
      coverImage: '/images/social/pemeriksaan-kesehatan-lansia.jpg',
      order: 7,
    },
  ];

  for (const item of impacts) {
    const existing = await prisma.socialImpact.findFirst({
      where: { titleId: item.titleId },
    });
    if (!existing) {
      await prisma.socialImpact.create({ data: item });
      console.log(`  ✓ Created Social Impact: ${item.titleId}`);
    } else {
      await prisma.socialImpact.update({
        where: { id: existing.id },
        data: item,
      });
      console.log(`  ✓ Updated Social Impact: ${item.titleId}`);
    }
  }

  // 2. Blog Posts
  const posts = [
    {
      slug: 'menjaga-keberlanjutan-warisan-budaya-indonesia-melalui-bisnis-modern',
      titleId: 'Menjaga Keberlanjutan Warisan Budaya Indonesia Melalui Bisnis Modern',
      titleEn: 'Preserving Indonesian Cultural Heritage Through Modern Business',
      excerptId: 'Bagaimana Warma Heritage Group mengintegrasikan nilai-nilai luhur nusantara dengan tata kelola bisnis berkelanjutan untuk pasar global.',
      excerptEn: 'How Warma Heritage Group integrates timeless Indonesian values with sustainable business practices for global markets.',
      contentId: `Indonesia memiliki kekayaan budaya, kriya, dan tradisi luhur yang telah diwariskan dari generasi ke generasi. Di era globalisasi saat ini, tantangan terbesar kita bukan hanya melestarikan warisan tersebut, melainkan menjadikannya tetap relevan, berdaya saing, dan memberikan dampak ekonomi nyata bagi masyarakat.\n\nWarma Heritage Group lahir dengan komitmen untuk menjadi jembatan antara kekayaan kriya tradisional Indonesia dengan standar pasar internasional. Melalui berbagai unit usaha di bidang kerajinan rotan alami, kriya kayu nusantara, perlengkapan upacara adat Bali, hingga akademi tari, kami membuktikan bahwa bisnis modern dapat tumbuh selaras dengan pelestarian budaya.\n\nKeberlanjutan bukan sekadar slogan, melainkan prinsip kerja sehari-hari: memberdayakan pengrajin lokal, menggunakan material ramah lingkungan, dan menjaga etika kebersamaan nusantara.`,
      contentEn: `Indonesia possesses an extraordinary wealth of culture, craftsmanship, and noble traditions passed down through generations. In today's globalized era, our greatest challenge is not merely preserving this heritage, but keeping it relevant, competitive, and economically beneficial for local communities.\n\nWarma Heritage Group was founded with a deep commitment to bridge traditional craftsmanship with international market standards. Through subsidiaries spanning natural rattan, wood artistry, Balinese ceremonial supplies, and cultural academies, we prove that modern enterprises can thrive in harmony with cultural preservation.\n\nSustainability is our daily practice: empowering artisans, utilizing sustainable materials, and honoring communal values.`,
      category: 'Wawasan',
      author: 'Warma Heritage Group',
      readTime: '3 min',
      coverImage: '/images/companies/karya-rotan-indonesia.png',
      published: true,
      publishedAt: new Date('2026-10-10'),
    },
    {
      slug: 'rotan-indonesia-menembus-pasar-dunia-harmoni-alam-dan-kriya',
      titleId: 'Rotan Indonesia Menembus Pasar Dunia: Harmoni Alam dan Kriya',
      titleEn: 'Indonesian Rattan on the World Stage: Harmony of Nature and Craftsmanship',
      excerptId: 'Eksplorasi potensi rotan alami Indonesia sebagai furnitur bernilai tinggi yang diminati pasar Eropa, Amerika, dan Asia.',
      excerptEn: 'Exploring the potential of Indonesian natural rattan as premium sustainable furniture loved across Europe, America, and Asia.',
      contentId: `Rotan adalah salah satu anugerah alam terbesar Indonesia, di mana lebih dari 70% pasokan rotan mentah dunia berasal dari hutan nusantara. Namun, nilai sejati rotan bukan hanya pada bahan mentahnya, melainkan pada sentuhan tangan terampil para pengrajin yang menganyamnya dengan ketelitian tinggi.\n\nMelalui Karya Rotan Indonesia dan Rattan Export House Indonesia, Warma Heritage Group menghadirkan desain-desain furnitur kontemporer yang menggabungkan estetika minimalis modern dengan kehangatan tekstur alami rotan. Produk-produk ini telah diekspor ke berbagai negara, membuktikan bahwa karya anak bangsa memiliki tempat istimewa di panggung desain global.\n\nKomitmen kami adalah terus mendukung pengelolaan hutan rotan lestari serta memastikan regenerasi keahlian menganyam di kalangan generasi muda pengrajin.`,
      contentEn: `Rattan is one of Indonesia's greatest natural gifts, with over 70% of the world's raw rattan originating from our archipelago's forests. Yet the true value of rattan lies not merely in the raw material, but in the skilled hands of artisans who weave it with consummate patience.\n\nThrough Karya Rotan Indonesia and Rattan Export House Indonesia, Warma Heritage Group brings contemporary furniture designs blending modern aesthetics with the organic warmth of natural rattan to global destinations.`,
      category: 'Ekspor',
      author: 'Warma Heritage Group',
      readTime: '4 min',
      coverImage: '/images/companies/rattan-export-house-indonesia.png',
      published: true,
      publishedAt: new Date('2026-10-12'),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`  ✓ Synced Post: ${post.slug}`);
  }

  console.log('✅ Initial seed completed successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
