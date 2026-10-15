'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminHeaderProps {
  unreadCount?: number;
  onToggleMobileMenu?: () => void;
}

export default function AdminHeader({
  unreadCount = 0,
  onToggleMobileMenu,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState('');

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

  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Portal', href: '/admin' }];

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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 sm:px-8 py-4 transition-all">
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

          <nav className="flex items-center space-x-2 text-xs text-gray-400">
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.href} className="flex items-center space-x-2">
                {idx > 0 && <span className="text-gray-300">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-gray-900 tracking-wide">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-gray-900 transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <span className="text-gray-300 text-xs hidden md:inline">•</span>
          <span className="text-[11px] text-gray-400 hidden md:inline-block">
            {currentDate}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Quick link: View Website */}
          <Link
            href="/"
            target="_blank"
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Lihat Website</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M5 3h8v8M13 3L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* Messages Notification */}
          <Link
            href="/admin/messages"
            className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors"
            title="Pesan Masuk"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2 4.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#141414] text-white text-[9px] font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <div className="h-4 w-px bg-gray-200" />

          {/* Admin Avatar */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#141414] text-white flex items-center justify-center font-serif text-[11px]">
              W
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <p className="text-xs text-gray-900 font-medium">Administrator</p>
              <p className="text-[10px] tracking-wider uppercase text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
