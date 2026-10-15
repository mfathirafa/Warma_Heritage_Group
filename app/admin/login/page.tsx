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
      {/* Left Panel — Dark Editorial Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#141414] text-white flex-col justify-between p-16">
        <div>
          <Image
            src="/Logo_clear.png"
            alt="Warma Heritage Group"
            width={130}
            height={44}
            className="brightness-0 invert opacity-95"
          />
        </div>

        <div className="max-w-md my-auto py-12">
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-4 font-sans">
            Admin Panel
          </p>
          <h1 className="text-4xl font-serif leading-tight text-white mb-6">
            Kelola konten<br />dengan presisi.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed font-sans">
            Portal administrasi resmi Warma Heritage Group untuk pengelolaan narasi blog, program dampak sosial, dan pesan masuk.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="w-6 h-px bg-gray-700" />
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
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">
              Admin Portal
            </p>
            <h2 className="text-3xl font-serif text-gray-900">
              Masuk
            </h2>
            <p className="text-gray-400 text-sm mt-1.5">
              Masukkan kredensial admin Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="admin@warmaheritagegroup.com"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline focus:outline-1 focus:outline-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline focus:outline-1 focus:outline-gray-900 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#141414] text-white text-sm py-3 tracking-wide hover:opacity-85 disabled:opacity-50 transition-opacity mt-2 cursor-pointer"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              ← Kembali ke Website
            </Link>
            <span>© {new Date().getFullYear()} WHG</span>
          </div>
        </div>
      </div>
    </div>
  );
}
