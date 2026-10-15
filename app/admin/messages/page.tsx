import { prisma } from '@/app/lib/prisma';
import type { Metadata } from 'next';
import MessagesTableClient from './components/MessagesTableClient';

export const metadata: Metadata = { title: 'Inbox Pesan Masuk' };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Pusat Komunikasi & Kemitraan
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-tight">
              Inbox Pesan Masuk
            </h1>
            {unreadCount > 0 && (
              <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {unreadCount} Pesan Baru
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Pesan dan permohonan kemitraan dari formulir kontak website utama.
          </p>
        </div>
      </div>

      <MessagesTableClient
        messages={messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
          company: m.company ?? null,
        }))}
      />
    </div>
  );
}
