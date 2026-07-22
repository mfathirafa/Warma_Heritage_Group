'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-8">
            <div className="max-w-lg text-center flex flex-col items-center gap-8">
                <img
                    src="/Logo_clear.png"
                    alt="Warma Heritage Group"
                    className="w-32 opacity-50"
                />
                <div className="flex flex-col gap-4">
                    <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">400</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Halaman Tidak Ditemukan
                    </h1>
                    <p className="text-base text-gray-500 leading-relaxed">
                        Halaman yang anda cari tidak tersedia atau telah dipindahkan.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={() => router.push('/')}
                        className="px-8 py-4 bg-gray-900 text-white text-sm tracking-widest uppercase hover:bg-gray-700 transition-colors duration-300">
                        Kembali ke Beranda 
                    </button>
                    <a
                        href="https://wa.me/6281239669880?text=Halo%20Warma%20Heritage%20Group%2C%20saya%20membutuhkan%20bantuan."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 border border-gray-900 text-gray-900 text-sm tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-colors duration-300"
                    >
                        Hubungi Kami
                    </a>
                </div>
            </div>
        </main>
    );
}