'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { ToastProvider } from './ToastProvider';

interface AdminShellProps {
  children: React.ReactNode;
  unreadCount?: number;
  postCount?: number;
}

export default function AdminShell({
  children,
  unreadCount = 0,
  postCount = 0,
}: AdminShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      {/*
        h-screen + overflow-hidden on root = page itself never scrolls.
        Only the <main> inner div scrolls.
        This fixes: blank first screen, sidebar disappearing on scroll.
      */}
      <div className="h-screen bg-[#F9F9F8] text-[#141414] antialiased flex overflow-hidden font-sans">

        {/* Desktop Sidebar — fixed height column, no scroll */}
        <div className="hidden lg:flex shrink-0">
          <AdminSidebar unreadCount={unreadCount} postCount={postCount} />
        </div>

        {/* Mobile Slide-over Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <div
          className={`fixed top-0 left-0 bottom-0 z-50 w-[270px] transform transition-transform duration-300 lg:hidden ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <AdminSidebar
            unreadCount={unreadCount}
            postCount={postCount}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* Main Area — flex-1, only this scrolls */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader
            unreadCount={unreadCount}
            onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1440px] w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
