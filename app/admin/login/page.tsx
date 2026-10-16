'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Email atau password salah.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white text-[#141414]">
      {/* Left Panel — Dark Editorial Brand with Texture */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#121212] text-white flex-col justify-between p-16 relative overflow-hidden">
        {/* Subtle background image texture */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Warma Heritage Texture"
            fill
            className="object-cover opacity-15 mix-blend-luminosity filter brightness-75 contrast-125"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-[#121212]/90" />
        </div>

        <div className="relative z-10">
          <Image
            src="/Logo_clear.png"
            alt="Warma Heritage Group"
            width={130}
            height={44}
            className="brightness-0 invert opacity-95"
          />
        </div>

        <div className="max-w-md my-auto py-12 relative z-10">
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-4 font-sans font-medium">
            Panel Administrasi
          </p>
          <h1 className="text-4xl font-serif leading-tight text-white mb-6">
            Kelola konten<br />dengan presisi.
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed font-sans">
            Portal administrasi resmi Warma Heritage Group untuk pengelolaan narasi blog, inisiatif dampak sosial, dan pesan kemitraan.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 relative z-10">
          <div className="w-6 h-px bg-gray-600" />
          <span className="tracking-widest uppercase">Warma Heritage Group</span>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-16 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Image src="/Logo_clear.png" alt="Warma Heritage Group" width={110} height={38} />
          </div>

          <div className="mb-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-2 font-medium">
              Admin Portal
            </p>
            <h2 className="text-3xl font-serif text-gray-900">
              Masuk
            </h2>
            <p className="text-gray-500 text-sm mt-1.5">
              Masukkan kredensial administrator Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-start gap-2.5">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-red-600">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M8 4.5v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-gray-500 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="admin@warmaheritagegroup.com"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] [&:-webkit-autofill]:text-gray-900"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-gray-500 font-medium mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) => {
                    setCapsLockOn(Boolean(e.getModifierState && e.getModifierState('CapsLock')));
                  }}
                  onKeyDown={(e) => {
                    setCapsLockOn(Boolean(e.getModifierState && e.getModifierState('CapsLock')));
                  }}
                  required
                  placeholder="••••••••••••"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] [&:-webkit-autofill]:text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 text-xs font-medium cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>

              {capsLockOn && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2l4 5H9v6H7V7H4l4-5z" fill="currentColor" />
                  </svg>
                  <span>Peringatan: Tombol Caps Lock sedang aktif</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#141414] text-white text-sm py-3 rounded-lg font-medium tracking-wide hover:bg-black disabled:opacity-50 transition-all mt-2 cursor-pointer shadow-xs"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[11px] text-gray-500 text-center">
              Lupa kata sandi?{' '}
              <span className="text-gray-800 font-medium">Hubungi administrator sistem.</span>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              ← Kembali ke Website
            </Link>
            <span className="lining-nums">© {new Date().getFullYear()} WHG</span>
          </div>
        </div>
      </div>
    </div>
  );
}
