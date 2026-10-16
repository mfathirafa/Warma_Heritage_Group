'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AdminHeaderProps {
  unreadCount?: number;
  onToggleMobileMenu?: () => void;
}

export default function AdminHeader({
  unreadCount = 0,
  onToggleMobileMenu,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    setCurrentDate(formatted);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  }

  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Dasbor', href: '/admin' }];

    if (parts.length > 1) {
      if (parts[1] === 'blog') {
        crumbs.push({ label: 'Blog', href: '/admin/blog' });
        if (parts[2] === 'new') crumbs.push({ label: 'Tulis Artikel', href: '/admin/blog/new' });
        else if (parts[3] === 'edit') crumbs.push({ label: 'Edit Artikel', href: pathname });
      } else if (parts[1] === 'social-impact') {
        crumbs.push({ label: 'Dampak Sosial', href: '/admin/social-impact' });
        if (parts[2] === 'new') crumbs.push({ label: 'Program Baru', href: '/admin/social-impact/new' });
        else if (parts[3] === 'edit') crumbs.push({ label: 'Edit Program', href: pathname });
      } else if (parts[1] === 'messages') {
        crumbs.push({ label: 'Pesan Masuk', href: '/admin/messages' });
      }
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 sm:px-8 py-3.5 transition-all">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            {onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                aria-label="Buka navigasi"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}

            <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
              {breadcrumbs.map((crumb, idx) => (
                <div key={crumb.href} className="flex items-center space-x-2">
                  {idx > 0 && <span className="text-gray-300">/</span>}
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="font-semibold text-gray-900 tracking-wide">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-gray-900 transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <span className="text-gray-300 text-xs hidden md:inline">•</span>
            <span className="text-[11px] text-gray-500 hidden md:inline-block lining-nums">
              {currentDate}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Quick link: View Website */}
            <Link
              href="/"
              target="_blank"
              className="text-xs text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              <span>Lihat Website</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M5 3h8v8M13 3L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Messages Notification */}
            <Link
              href="/admin/messages"
              className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors"
              title="Pesan Masuk"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M2 4.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#141414] text-white text-[9px] font-bold lining-nums">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="h-4 w-px bg-gray-200" />

            {/* Admin Avatar & Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-left"
                aria-label="Menu profil administrator"
              >
                <div className="w-7 h-7 rounded-full bg-[#141414] text-white flex items-center justify-center font-serif text-[11px] font-medium shadow-xs">
                  W
                </div>
                <div className="hidden lg:block leading-tight">
                  <p className="text-xs text-gray-900 font-semibold">Administrator</p>
                  <p className="text-[10px] tracking-wider uppercase text-gray-500">WHG Admin</p>
                </div>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-gray-400 hidden lg:block">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-900">Administrator</p>
                    <p className="text-[10px] text-gray-400 truncate">admin@warmaheritagegroup.com</p>
                  </div>

                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M8 1.5C6 3.5 5 5.5 5 8s1 4.5 3 6.5" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                    <span>Buka Website</span>
                  </Link>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      <path d="M10 11l3-3-3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="13" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <span>Keluar Sesi</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Keluar dari Admin Portal?</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Anda perlu masuk kembali untuk mengakses panel administrasi Warma Heritage Group.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
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
