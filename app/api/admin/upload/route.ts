import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { getSession } from '@/app/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;
    let baseName = 'upload';
    let ext = '.webp';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      const inputUrl = (body.url || '').trim();
      if (!inputUrl) {
        return NextResponse.json({ error: 'URL gambar tidak boleh kosong.' }, { status: 400 });
      }

      // Handle Google Drive Link
      const gdriveMatch = inputUrl.match(/drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|(?:open|uc)\?id=([a-zA-Z0-9_-]+))/);
      const fileId = gdriveMatch ? (gdriveMatch[1] || gdriveMatch[2]) : null;

      if (fileId) {
        let fetchRes = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });

        if (!fetchRes.ok || fetchRes.headers.get('content-type')?.includes('text/html')) {
          fetchRes = await fetch(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });
        }

        if (!fetchRes.ok || fetchRes.headers.get('content-type')?.includes('text/html')) {
          return NextResponse.json(
            { error: 'Gagal mengambil gambar dari Google Drive. Pastikan izin berbagi file disetel ke "Siapa saja yang memiliki link dapat melihat".' },
            { status: 400 }
          );
        }

        buffer = Buffer.from(await fetchRes.arrayBuffer());
        baseName = `gdrive-${fileId.slice(0, 12)}`;
      } else {
        // Regular URL
        const fetchRes = await fetch(inputUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        if (!fetchRes.ok) {
          return NextResponse.json({ error: 'Gagal mengunduh gambar dari URL.' }, { status: 400 });
        }
        buffer = Buffer.from(await fetchRes.arrayBuffer());
        const pathname = new URL(inputUrl).pathname;
        const parsedExt = path.extname(pathname).toLowerCase();
        baseName = path.basename(pathname, parsedExt).replace(/[^\w-]/g, '').toLowerCase().slice(0, 25) || 'image';
      }
    } else {
      // Multipart form data
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const inputUrl = formData.get('url') as string | null;

      if (inputUrl && inputUrl.trim()) {
        const trimmedUrl = inputUrl.trim();
        const gdriveMatch = trimmedUrl.match(/drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|(?:open|uc)\?id=([a-zA-Z0-9_-]+))/);
        const fileId = gdriveMatch ? (gdriveMatch[1] || gdriveMatch[2]) : null;

        if (fileId) {
          let fetchRes = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });

          if (!fetchRes.ok || fetchRes.headers.get('content-type')?.includes('text/html')) {
            fetchRes = await fetch(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`, {
              headers: { 'User-Agent': 'Mozilla/5.0' },
            });
          }

          if (!fetchRes.ok || fetchRes.headers.get('content-type')?.includes('text/html')) {
            return NextResponse.json(
              { error: 'Gagal mengambil gambar dari Google Drive. Pastikan izin berbagi disetel ke "Siapa saja dengan link".' },
              { status: 400 }
            );
          }

          buffer = Buffer.from(await fetchRes.arrayBuffer());
          baseName = `gdrive-${fileId.slice(0, 12)}`;
        } else {
          const fetchRes = await fetch(trimmedUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          if (!fetchRes.ok) {
            return NextResponse.json({ error: 'Gagal mengunduh gambar dari URL.' }, { status: 400 });
          }
          buffer = Buffer.from(await fetchRes.arrayBuffer());
          const pathname = new URL(trimmedUrl).pathname;
          const parsedExt = path.extname(pathname).toLowerCase();
          baseName = path.basename(pathname, parsedExt).replace(/[^\w-]/g, '').toLowerCase().slice(0, 25) || 'image';
        }
      } else if (file) {
        // Validate mime type (strict: no SVG to prevent stored XSS attacks)
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
        if (!validTypes.includes(file.type)) {
          return NextResponse.json(
            { error: 'Format file tidak didukung. Gunakan JPG, PNG, WebP, GIF, atau AVIF.' },
            { status: 400 }
          );
        }

        const bytes = await file.arrayBuffer();
        buffer = Buffer.from(bytes);

        const rawExt = path.extname(file.name);
        baseName = path.basename(file.name, rawExt).replace(/[^\w-]/g, '').toLowerCase().slice(0, 30) || 'upload';
      } else {
        return NextResponse.json({ error: 'Tidak ada file atau URL yang dikirimkan.' }, { status: 400 });
      }
    }

    const originalSize = buffer.length;

    // Limit maximum raw file size to 25MB before compression
    if (originalSize > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar. Maksimal 25MB sebelum kompresi.' },
        { status: 400 }
      );
    }

    // =========================================================================
    // SISTEM KOMPRESI OTOMATIS BERKUALITAS HD DENGAN SHARP
    // - Auto rotate EXIF orientasi kamera smartphone
    // - Resize max width / height 1600px (standard Retina / Full HD web display)
    // - Konversi ke format WebP kualitas 82 (lossy visually lossless, hemat 80-95%)
    // =========================================================================
    let processedBuffer = buffer;
    try {
      const image = sharp(buffer, { failOnError: false });
      const metadata = await image.metadata();

      if (metadata.format) {
        processedBuffer = await image
          .rotate() // auto-orient camera rotation
          .resize({
            width: 1600,
            height: 1600,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({
            quality: 82,
            effort: 4,
          })
          .toBuffer();
        ext = '.webp';
      }
    } catch (sharpError) {
      console.warn('[UPLOAD SHARP WARNING] Gagal melakukan optimasi gambar, menggunakan file asli:', sharpError);
      ext = '.jpg';
    }

    const compressedSize = processedBuffer.length;
    const savingsPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

    const fileName = `${Date.now()}-${baseName}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, processedBuffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      originalSize,
      compressedSize,
      savingsPercent,
    });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    return NextResponse.json({ error: 'Gagal mengunggah file gambar.' }, { status: 500 });
  }
}
