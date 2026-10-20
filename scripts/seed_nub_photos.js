const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding NUB photos...');

  // 1. Posters (34.jpg - 54.jpg)
  const posterDir = path.join(__dirname, '..', 'public', 'images', 'nub', 'posters');
  const posterFiles = fs.readdirSync(posterDir).filter(f => f.endsWith('.jpg')).sort((a, b) => {
    const numA = parseInt(a.replace('.jpg', ''), 10) || 0;
    const numB = parseInt(b.replace('.jpg', ''), 10) || 0;
    return numA - numB;
  });

  console.log(`Found ${posterFiles.length} poster files`);

  let orderIndex = 1;
  for (const file of posterFiles) {
    const num = file.replace('.jpg', '');
    const imgUrl = `/images/nub/posters/${file}`;
    
    // Check if already exists
    const existing = await prisma.companyPhoto.findFirst({
      where: { companySlug: 'nada-upacara-bali', imageUrl: imgUrl }
    });

    if (!existing) {
      await prisma.companyPhoto.create({
        data: {
          companySlug: 'nada-upacara-bali',
          category: 'poster',
          titleId: `Poster Repertoar Pagelaran Seni #${num}`,
          titleEn: `Cultural Repertoire Performance Poster #${num}`,
          imageUrl: imgUrl,
          order: orderIndex++,
          published: true,
        }
      });
      console.log(`Created poster: ${file}`);
    } else {
      await prisma.companyPhoto.update({
        where: { id: existing.id },
        data: { category: 'poster', order: orderIndex++ }
      });
      console.log(`Updated poster category: ${file}`);
    }
  }

  // 2. Documentation (frame-40.jpg - frame-54.jpg)
  const docDir = path.join(__dirname, '..', 'public', 'images', 'nub', 'docs');
  const docFiles = fs.readdirSync(docDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Found ${docFiles.length} documentation files`);

  let docIndex = 1;
  for (const file of docFiles) {
    const cleanNum = file.replace('frame-', '').replace('.jpg', '');
    const imgUrl = `/images/nub/docs/${file}`;

    const existing = await prisma.companyPhoto.findFirst({
      where: { companySlug: 'nada-upacara-bali', imageUrl: imgUrl }
    });

    if (!existing) {
      await prisma.companyPhoto.create({
        data: {
          companySlug: 'nada-upacara-bali',
          category: 'documentation',
          titleId: `Dokumentasi Upacara & Pagelaran Seni (Momen #${cleanNum})`,
          titleEn: `Ceremonial & Performance Documentation (Moment #${cleanNum})`,
          imageUrl: imgUrl,
          order: docIndex++,
          published: true,
        }
      });
      console.log(`Created documentation: ${file}`);
    } else {
      await prisma.companyPhoto.update({
        where: { id: existing.id },
        data: { category: 'documentation', order: docIndex++ }
      });
      console.log(`Updated documentation category: ${file}`);
    }
  }

  const total = await prisma.companyPhoto.count({ where: { companySlug: 'nada-upacara-bali' } });
  console.log(`Total NUB photos in database: ${total}`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Error seeding NUB photos:', e);
  process.exit(1);
});
