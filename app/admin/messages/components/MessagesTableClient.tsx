'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesTableClient({
  messages: initialMessages,
}: {
  messages: Message[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(
    initialMessages.length > 0 ? initialMessages[0] : null
  );
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  // Filter messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        (m.company && m.company.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unread' && !m.isRead) ||
        (statusFilter === 'read' && m.isRead);

      return matchSearch && matchStatus;
    });
  }, [messages, search, statusFilter]);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  async function handleToggleRead(id: number, currentReadStatus: boolean) {
    const nextStatus = !currentReadStatus;
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead: nextStatus }),
    });

    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: nextStatus } : m))
    );

    if (selectedMsg?.id === id) {
      setSelectedMsg((prev) => (prev ? { ...prev, isRead: nextStatus } : null));
    }
    router.refresh();
  }

  async function handleMarkAllAsRead() {
    setMarkingAll(true);
    try {
      const unreadMessages = messages.filter((m) => !m.isRead);
      await Promise.all(
        unreadMessages.map((m) =>
          fetch(`/api/admin/messages/${m.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isRead: true }),
          })
        )
      );

      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      if (selectedMsg) setSelectedMsg((prev) => (prev ? { ...prev, isRead: true } : null));
      router.refresh();
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      const nextMessages = messages.filter((m) => m.id !== id);
      setMessages(nextMessages);
      if (selectedMsg?.id === id) {
        setSelectedMsg(nextMessages.length > 0 ? nextMessages[0] : null);
      }
      router.refresh();
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  function handleSelectMessage(msg: Message) {
    setSelectedMsg(msg);
    if (!msg.isRead) {
      handleToggleRead(msg.id, false);
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-[#F5F5F4] p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Semua ({messages.length})
          </button>
          <button
            onClick={() => setStatusFilter('unread')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === 'unread'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
            <span>Belum Dibaca ({unreadCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('read')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              statusFilter === 'read'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sudah Dibaca ({messages.length - unreadCount})
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md ml-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pengirim, email, atau subjek..."
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg pl-9 pr-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
            />
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="absolute left-3 top-2.5 text-gray-400"
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shrink-0 disabled:opacity-50"
            >
              {markingAll ? 'Memproses...' : 'Tandai Semua Dibaca'}
            </button>
          )}
        </div>
      </div>

      {/* Split-Pane Inbox Layout */}
      <div
        className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        style={{ minHeight: '620px' }}
      >
        {/* Left Column: Message Feed (5 cols) */}
        <div className="lg:col-span-5 border-r border-gray-100 flex flex-col bg-[#FDFDFC]">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-[11px] tracking-wider uppercase font-semibold text-gray-400">
              Daftar Pesan Masuk
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {filteredMessages.length} pesan
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 max-h-[640px]">
            {filteredMessages.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-xs">
                Tidak ada pesan yang sesuai dengan filter.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMsg?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 cursor-pointer transition-all flex items-start gap-3.5 relative ${
                      isSelected
                        ? 'bg-amber-50/40 border-l-2 border-amber-600'
                        : 'hover:bg-gray-50/70 border-l-2 border-transparent'
                    }`}
                  >
                    {/* Avatar Initials */}
                    <div
                      className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                        !msg.isRead
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {getInitials(msg.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs truncate ${!msg.isRead ? 'font-bold text-gray-950' : 'font-medium text-gray-700'}`}>
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                          {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      <p className={`text-xs truncate ${!msg.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        {msg.subject}
                      </p>

                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {msg.message}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        {msg.company && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 truncate max-w-[140px]">
                            {msg.company}
                          </span>
                        )}
                        {!msg.isRead && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                            Baru
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Reading Detail Panel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white">
          {selectedMsg ? (
            <div className="flex-1 flex flex-col">
              {/* Message Header */}
              <div className="p-6 border-b border-gray-100 bg-[#FAF9F7]">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Inquiry Komunikasi
                    </span>
                    <h2 className="text-xl font-serif text-gray-900 font-medium mt-2">
                      {selectedMsg.subject}
                    </h2>
                  </div>

                  {/* Actions: Mark read & Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleRead(selectedMsg.id, selectedMsg.isRead)}
                      className="px-2.5 py-1 text-xs text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
                      title={selectedMsg.isRead ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                    >
                      {selectedMsg.isRead ? 'Tandai Belum Dibaca' : 'Tandai Dibaca'}
                    </button>

                    {confirmId === selectedMsg.id ? (
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(selectedMsg.id)}
                          disabled={deletingId === selectedMsg.id}
                          className="px-2 py-1 text-xs text-white bg-red-600 rounded-md"
                        >
                          {deletingId === selectedMsg.id ? '...' : 'Hapus'}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="px-2 py-1 text-xs text-gray-500"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(selectedMsg.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus Pesan"
                      >
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M2.5 4h11M5.5 4V2.5a1 1 0 011-1h3a1 1 0 011 1V4M6.5 7v5M9.5 7v5M4 4l.8 9.5a1 1 0 001 .5h4.4a1 1 0 001-.5L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sender Card info */}
                <div className="p-3 bg-white rounded-lg border border-gray-200/80 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-semibold">
                      {getInitials(selectedMsg.name)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{selectedMsg.name}</p>
                      <p className="text-[11px] text-gray-500">
                        <a href={`mailto:${selectedMsg.email}`} className="text-amber-800 hover:underline">
                          {selectedMsg.email}
                        </a>
                        {selectedMsg.company && (
                          <span className="text-gray-400"> • {selectedMsg.company}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(selectedMsg.createdAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-8 flex-1 overflow-y-auto">
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans max-w-prose">
                  {selectedMsg.message}
                </div>
              </div>

              {/* Bottom Quick Reply Action Bar */}
              <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[11px] text-gray-400">
                  Balas langsung melalui email resmi Warma Heritage Group
                </p>

                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(
                    selectedMsg.subject
                  )}&body=${encodeURIComponent(
                    `\n\n---\nPada ${new Date(selectedMsg.createdAt).toLocaleString(
                      'id-ID'
                    )}, ${selectedMsg.name} menulis:\n> ${selectedMsg.message}`
                  )}`}
                  className="inline-flex items-center gap-2 bg-[#141414] hover:bg-black text-white text-xs font-medium px-4 py-2 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M1.5 3.5h13v9h-13v-9z" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M1.5 4.5l6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                  <span>Balas via Email Klien</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400">
              <svg width="32" height="32" viewBox="0 0 16 16" fill="none" className="mb-3 text-gray-300">
                <rect x="1.5" y="2.5" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <path d="M2 4.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <p className="text-sm font-medium text-gray-700">Pilih pesan di sebelah kiri</p>
              <p className="text-xs text-gray-400 mt-1">
                Klik salah satu pesan masuk untuk membaca dan memberikan tanggapan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
