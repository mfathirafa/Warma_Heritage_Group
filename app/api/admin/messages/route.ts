import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('[GET /api/admin/messages]', error);
    return NextResponse.json({ error: 'Gagal mengambil daftar pesan.' }, { status: 500 });
  }
}
