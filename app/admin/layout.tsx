import type { Metadata } from 'next';
import { prisma } from '@/app/lib/prisma';
import AdminShell from './components/AdminShell';

export const metadata: Metadata = {
  title: {
    default: 'Admin Panel',
    template: '%s — Admin | Warma Heritage Group',
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let unreadCount = 0;
  let postCount = 0;

  try {
    const [unread, posts] = await Promise.all([
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.post.count(),
    ]);
    unreadCount = unread;
    postCount = posts;
  } catch (error) {
    console.error('[AdminLayout] Failed to fetch sidebar counts:', error);
  }

  return (
    <AdminShell unreadCount={unreadCount} postCount={postCount}>
      {children}
    </AdminShell>
  );
}
