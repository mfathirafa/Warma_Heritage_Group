import 'server-only';
import { cookies } from 'next/headers';

const SECRET = process.env.SESSION_SECRET || 'warma-admin-secret-key-2024-xk9p';

// 4 hours session duration (idle timeout)
export const SESSION_DURATION = 4 * 60 * 60 * 1000;

async function getKey(): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(SECRET);
  return crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export interface SessionPayload {
  userId: number;
  email: string;
  name: string;
  expiresAt: number;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  const json = JSON.stringify(payload);
  const encoded = btoa(json);
  const key = await getKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encoded));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${encoded}.${sigB64}`;
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const [encoded, sigB64] = token.split('.');
    if (!encoded || !sigB64) return null;
    const key = await getKey();
    const sig = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(encoded));
    if (!valid) return false as any;
    const payload: SessionPayload = JSON.parse(atob(encoded));
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(payload: Omit<SessionPayload, 'expiresAt'> & { expiresAt?: number }): Promise<void> {
  const expiresAt = payload.expiresAt || Date.now() + SESSION_DURATION;
  const token = await encrypt({ ...payload, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(expiresAt),
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  return decrypt(token);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}
