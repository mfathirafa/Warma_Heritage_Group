import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getSession } from '@/app/lib/session';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Akses ditolak: Anda belum terautentikasi' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;
    let fileName: string;
    let ext = '.jpg';
    let baseName = 'upload';

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
        ext = '.jpg';
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
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(parsedExt)) {
          ext = parsedExt;
        }
        baseName = path.basename(pathname, ext).replace(/[^\w-]/g, '').toLowerCase().slice(0, 25) || 'image';
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
          ext = '.jpg';
        } else {
          const fetchRes = await fetch(trimmedUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          if (!fetchRes.ok) {
            return NextResponse.json({ error: 'Gagal mengunduh gambar dari URL.' }, { status: 400 });
          }
          buffer = Buffer.from(await fetchRes.arrayBuffer());
          const pathname = new URL(trimmedUrl).pathname;
          const parsedExt = path.extname(pathname).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(parsedExt)) {
            ext = parsedExt;
          }
          baseName = path.basename(pathname, ext).replace(/[^\w-]/g, '').toLowerCase().slice(0, 25) || 'image';
        }
      } else if (file) {
        // Validate mime type (strict: no SVG to prevent stored XSS attacks)
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          return NextResponse.json(
            { error: 'Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.' },
            { status: 400 }
          );
        }

        const bytes = await file.arrayBuffer();
        buffer = Buffer.from(bytes);

        const rawExt = path.extname(file.name);
        ext = (rawExt || '.jpg').toLowerCase();
        baseName = path.basename(file.name, rawExt).replace(/[^\w-]/g, '').toLowerCase().slice(0, 30);
      } else {
        return NextResponse.json({ error: 'Tidak ada file atau URL yang dikirimkan.' }, { status: 400 });
      }
    }

    // Limit to 8MB
    if (buffer.length > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar. Maksimal 8MB.' },
        { status: 400 }
      );
    }

    fileName = `${Date.now()}-${baseName || 'upload'}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    return NextResponse.json({ error: 'Gagal mengunggah file gambar.' }, { status: 500 });
  }
}
