import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { compareSync } from 'bcryptjs';
import { createSession } from '@/app/lib/session';

interface AttemptRecord {
  count: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const attempt = loginAttempts.get(normalizedEmail);

    if (attempt?.lockedUntil && Date.now() < attempt.lockedUntil) {
      const remainingMinutes = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
      return NextResponse.json(
        {
          error: `Akun terkunci sementara karena terlalu banyak percobaan gagal. Silakan coba lagi dalam ${remainingMinutes} menit.`,
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      // Record failed attempt
      const current = loginAttempts.get(normalizedEmail) || { count: 0 };
      const nextCount = current.count + 1;
      const lockedUntil = nextCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : undefined;
      loginAttempts.set(normalizedEmail, { count: nextCount, lockedUntil });

      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const passwordMatch = compareSync(password, user.password);
    if (!passwordMatch) {
      const current = loginAttempts.get(normalizedEmail) || { count: 0 };
      const nextCount = current.count + 1;
      const lockedUntil = nextCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : undefined;
      loginAttempts.set(normalizedEmail, { count: nextCount, lockedUntil });

      const remaining = MAX_ATTEMPTS - nextCount;
      const warning =
        remaining > 0
          ? `Email atau password salah. Sisa ${remaining} kesempatan sebelum akun terkunci.`
          : 'Terlalu banyak percobaan gagal. Akun dikunci sementara selama 15 menit.';

      return NextResponse.json({ error: warning }, { status: remaining > 0 ? 401 : 429 });
    }

    // Success: clear failed attempts
    loginAttempts.delete(normalizedEmail);

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[LOGIN ERROR]', error);
    const errStr = String(error?.message || error || '');
    const isPrismaError =
      error?.name === 'PrismaClientInitializationError' ||
      error?.name === 'PrismaClientKnownRequestError' ||
      error?.name === 'PrismaClientRustPanicError' ||
      errStr.includes("Can't reach database server") ||
      errStr.includes('ETIMEDOUT') ||
      errStr.includes('ECONNREFUSED') ||
      errStr.includes('Access denied') ||
      errStr.includes('build_dummy');

    const errorMessage = isPrismaError
      ? 'Koneksi ke database MySQL Hostinger gagal. Pastikan DATABASE_URL sudah diisi di Environment Variables Vercel/Hostinger dan menu Remote MySQL di Hostinger sudah mengizinkan akses (% IP).'
      : 'Terjadi kesalahan server.';

    return NextResponse.json(
      {
        error: errorMessage,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}
