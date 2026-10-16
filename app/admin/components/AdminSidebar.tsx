'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface AdminSidebarProps {
  unreadCount?: number;
  postCount?: number;
  onClose?: () => void;
}

export default function AdminSidebar({
  unreadCount = 0,
  postCount = 0,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === '/admin/login') return null;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  }

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const navItems = [
    {
      label: 'Dasbor',
      href: '/admin',
      exact: true,
      // Badge: null — total artikel tidak perlu badge di sini
      badge: null as string | null,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      ),
    },
    {
      label: 'Blog',
      href: '/admin/blog',
      exact: false,
      // Badge hanya untuk draft, bukan total — lebih berguna
      badge: null as string | null,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <line x1="4.5" y1="5" x2="11.5" y2="5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="4.5" y1="8" x2="11.5" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="4.5" y1="11" x2="8.5" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Dampak Sosial',
      href: '/admin/social-impact',
      exact: false,
      badge: null as string | null,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 13.5s-5.5-3.2-5.5-7A3.5 3.5 0 0 1 8 3.5 3.5 3.5 0 0 1 13.5 6.5C13.5 10.3 8 13.5 8 13.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Pesan Masuk',
      href: '/admin/messages',
      exact: false,
      // Badge ke Pesan Masuk — ini yang penting untuk ditindak
      badge: unreadCount > 0 ? `${unreadCount} baru` : null,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M2 4.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <aside className="w-[260px] h-screen bg-[#141414] border-r border-white/5 flex flex-col select-none">
        {/* Brand Header */}
        <div className="px-6 py-7 border-b border-white/5 flex items-center justify-between shrink-0">
          <Link href="/admin" onClick={onClose} className="block">
            <Image
              src="/Logo_clear.png"
              alt="Warma Heritage Group"
              width={110}
              height={36}
              className="brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
            />
            <p className="text-[9px] tracking-[0.2em] uppercase text-gray-500 mt-2 font-sans">
              Panel Admin
            </p>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white p-1"
              aria-label="Tutup menu"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded text-sm transition-all ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? 'text-white' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium tracking-wide lining-nums">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-1 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors rounded hover:bg-white/5"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M8 1.5C6 3.5 5 5.5 5 8s1 4.5 3 6.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M8 1.5c2 2 3 4 3 6.5s-1 4.5-3 6.5" stroke="currentColor" strokeWidth="1.3" />
              <line x1="1.5" y1="8" x2="14.5" y2="8" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            <span>Buka Website</span>
          </Link>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-400 hover:text-red-400 transition-colors text-left rounded hover:bg-white/5"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M10 11l3-3-3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="13" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 11l3-3-3-3" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="13" y1="8" x2="6" y2="8" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Keluar dari Panel Admin?</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Anda akan keluar dari sesi ini dan perlu masuk kembali untuk mengakses panel admin.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {loggingOut ? (
                  <>
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Keluar...</span>
                  </>
                ) : (
                  <span>Ya, Keluar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
