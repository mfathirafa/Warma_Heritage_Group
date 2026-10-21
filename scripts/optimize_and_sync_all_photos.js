const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const prisma = new PrismaClient();

const ROOT = path.join(__dirname, '..');
const REFS_BASE = path.join(ROOT, 'refs', 'Rafa Website WHG', 'FOTO KEPERLUAN WEBSITE');

const FOLDER_MAP = {
  'karya-rotan-indonesia': path.join(REFS_BASE, 'KRI'),
  'rattan-export-house-indonesia': path.join(REFS_BASE, 'REHI'),
  'kriya-kayu-nusantara': path.join(REFS_BASE, 'Kriya Kayu Nusantara'),
  'niaga-rasa-indonesia': path.join(REFS_BASE, 'Niagarasa Export'),
  'bali-menari-academy': path.join(REFS_BASE, 'BMA'),
  'nada-upacara-bali': path.join(REFS_BASE, 'NUB'),
};

function normalizeName(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function main() {
  console.log('🚀 Starting Master Photo Compression & DB Sync...');
  
  const allPhotos = await prisma.companyPhoto.findMany({
    orderBy: [{ companySlug: 'asc' }, { order: 'asc' }]
  });

  console.log(`Found ${allPhotos.length} company photos in database.`);

  let totalOriginalBytes = 0;
  let totalCompressedBytes = 0;
  let successCount = 0;
  let skippedCount = 0;

  for (const photo of allPhotos) {
    const slug = photo.companySlug;
    const srcDir = FOLDER_MAP[slug];

    if (!srcDir || !fs.existsSync(srcDir)) {
      console.warn(`[WARN] Source dir not found for slug: ${slug}`);
      skippedCount++;
      continue;
    }

    // Identify source file
    // e.g. /uploads/1792461682660-frame40.jpg -> frame40
    // or /uploads/1792481076293-34.jpg -> 34
    const urlFilename = path.basename(photo.imageUrl);
    const cleanUrlName = normalizeName(urlFilename);

    const filesInDir = fs.readdirSync(srcDir);
    let matchedFile = null;

    // Direct match by removing non-alphanumeric (e.g. "Frame 40.jpg" -> "frame40jpg", "1792461682660-frame40.jpg" contains "frame40")
    for (const f of filesInDir) {
      const cleanF = normalizeName(path.parse(f).name);
      if (cleanUrlName.includes(cleanF)) {
        matchedFile = f;
        break;
      }
    }

    if (!matchedFile) {
      // Fallback: match by number if applicable
      const numMatch = cleanUrlName.match(/\d{2,3}/);
      if (numMatch) {
        for (const f of filesInDir) {
          if (normalizeName(f).includes(numMatch[0])) {
            matchedFile = f;
            break;
          }
        }
      }
    }

    if (!matchedFile) {
      console.warn(`[WARN] Could not find source file for ${photo.titleId} (${photo.imageUrl}) in ${srcDir}`);
      skippedCount++;
      continue;
    }

    const srcFilePath = path.join(srcDir, matchedFile);
    const stat = fs.statSync(srcFilePath);
    totalOriginalBytes += stat.size;

    // Define target directory and filenames
    const targetDir = path.join(ROOT, 'public', 'images', 'products', slug);
    fs.mkdirSync(targetDir, { recursive: true });

    const cleanBase = path.parse(matchedFile).name.toLowerCase().replace(/\s+/g, '-');
    const targetFilename = `${cleanBase}.webp`;
    const targetFilePath = path.join(targetDir, targetFilename);

    // Compress with sharp
    const webpBuffer = await sharp(srcFilePath)
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    fs.writeFileSync(targetFilePath, webpBuffer);
    totalCompressedBytes += webpBuffer.length;

    // Also write a copy to public/uploads matching the exact legacy filename in DB
    // so any cached references or direct uploads routes will never 404!
    const legacyUploadDir = path.join(ROOT, 'public', 'uploads');
    fs.mkdirSync(legacyUploadDir, { recursive: true });
    
    // Save as legacy filename (either .webp or same raw ext)
    const legacyFilePath = path.join(legacyUploadDir, urlFilename);
    fs.writeFileSync(legacyFilePath, webpBuffer);

    // New permanent semantic URL
    const newImageUrl = `/images/products/${slug}/${targetFilename}`;

    // Update database
    await prisma.companyPhoto.update({
      where: { id: photo.id },
      data: { imageUrl: newImageUrl }
    });

    successCount++;
    console.log(`✓ [${slug}] id:${photo.id} ${photo.titleId.slice(0, 30)}... | ${(stat.size / 1024 / 1024).toFixed(2)}MB -> ${(webpBuffer.length / 1024).toFixed(1)}KB -> ${newImageUrl}`);
  }

  const origMB = (totalOriginalBytes / 1024 / 1024).toFixed(2);
  const compMB = (totalCompressedBytes / 1024 / 1024).toFixed(2);
  const savedPercent = totalOriginalBytes > 0 
    ? Math.round(((totalOriginalBytes - totalCompressedBytes) / totalOriginalBytes) * 100) 
    : 0;

  console.log('\n=============================================');
  console.log(`🎉 Optimization Complete!`);
  console.log(`Success: ${successCount} photos processed & updated in DB`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Original Total: ${origMB} MB`);
  console.log(`Compressed Total: ${compMB} MB`);
  console.log(`Total Bandwidth / Storage Saved: ${savedPercent}%!`);
  console.log('=============================================\n');
}

main().catch(console.error).finally(() => prisma.$disconnect());
