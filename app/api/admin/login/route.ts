import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { compareSync } from 'bcryptjs';
import { createSession } from '@/app/lib/session';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const passwordMatch = compareSync(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
