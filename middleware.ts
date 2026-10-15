import { NextRequest, NextResponse } from 'next/server';

const SECRET = process.env.SESSION_SECRET || 'warma-admin-secret-key-2024-xk9p';
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours

async function getKey(): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(SECRET);
  return crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function verifySession(token: string): Promise<{ valid: boolean; payload?: any }> {
  try {
    const [encoded, sigB64] = token.split('.');
    if (!encoded || !sigB64) return { valid: false };
    const key = await getKey();
    const sig = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(encoded));
    if (!valid) return { valid: false };
    const payload = JSON.parse(atob(encoded));
    if (Date.now() > payload.expiresAt) return { valid: false };
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public authentication routes
  if (
    pathname === '/admin/login' ||
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/logout'
  ) {
    // If user is already logged in and visits /admin/login, redirect to /admin
    if (pathname === '/admin/login') {
      const token = request.cookies.get('admin_session')?.value;
      if (token) {
        const { valid } = await verifySession(token);
        if (valid) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
    }
    return NextResponse.next();
  }

  // Protect /api/admin/* API endpoints
  if (pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda belum terautentikasi' },
        { status: 401 }
      );
    }

    const { valid } = await verifySession(token);
    if (!valid) {
      const response = NextResponse.json(
        { error: 'Sesi Anda telah kedaluwarsa. Silakan login kembali.' },
        { status: 401 }
      );
      response.cookies.delete('admin_session');
      return response;
    }

    return NextResponse.next();
  }

  // Protect /admin/* UI pages
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const { valid } = await verifySession(token);
    if (!valid) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
