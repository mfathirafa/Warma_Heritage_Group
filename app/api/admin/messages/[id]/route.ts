import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const message = await prisma.contactMessage.findUnique({
      where: { id: Number(id) },
    });

    if (!message) {
      return NextResponse.json({ error: 'Pesan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('[GET /api/admin/messages/:id]', error);
    return NextResponse.json({ error: 'Gagal mengambil pesan.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isRead } = body;

    const message = await prisma.contactMessage.update({
      where: { id: Number(id) },
      data: {
        ...(typeof isRead === 'boolean' ? { isRead } : {}),
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('[PUT /api/admin/messages/:id]', error);
    return NextResponse.json({ error: 'Gagal memperbarui status pesan.' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.contactMessage.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/messages/:id]', error);
    return NextResponse.json({ error: 'Gagal menghapus pesan.' }, { status: 500 });
  }
}
