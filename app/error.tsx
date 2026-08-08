'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-8">
      <div className="max-w-lg text-center flex flex-col items-center gap-8">
        <img
          src="/Logo_clear.png"
          alt="Warma Heritage Group"
          className="w-32 opacity-50"
        />
        <div className="flex flex-col gap-4">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">Error</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Terjadi Kesalahan
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi kami jika masalah berlanjut.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={reset}
            className="px-8 py-4 bg-gray-900 text-white text-sm tracking-widest uppercase hover:bg-gray-700 transition-colors duration-300"
          >
            Coba Lagi
          </button>
          <a
            href="/"
            className="px-8 py-4 border border-gray-900 text-gray-900 text-sm tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-colors duration-300 text-center"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </main>
  );
}
