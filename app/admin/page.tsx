import { prisma } from '@/app/lib/prisma';
import { getSession } from '@/app/lib/session';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const session = await getSession();

  const [postCount, publishedPostCount, socialImpactCount, messageCount, unreadCount] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.socialImpact.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      titleId: true,
      slug: true,
      published: true,
      createdAt: true,
      category: true,
      coverImage: true,
    },
  });

  const recentMessages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      isRead: true,
      createdAt: true,
      company: true,
    },
  });

  const stats = [
    {
      label: 'Total Artikel',
      value: postCount,
      sub: `${publishedPostCount} dipublikasikan`,
      href: '/admin/blog',
      action: 'Kelola Blog →',
      icon: (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <line x1="4.5" y1="5.5" x2="11.5" y2="5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="4.5" y1="8.5" x2="11.5" y2="8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="4.5" y1="11.5" x2="8.5" y2="11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Dampak Sosial',
      value: socialImpactCount,
      sub: 'program aktif',
      href: '/admin/social-impact',
      action: 'Kelola Program →',
      icon: (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M8 13.5s-5.5-3.2-5.5-7A3.5 3.5 0 0 1 8 3.5 3.5 3.5 0 0 1 13.5 6.5C13.5 10.3 8 13.5 8 13.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Pesan Masuk',
      value: messageCount,
      sub: unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua terbaca',
      href: '/admin/messages',
      action: 'Buka Inbox →',
      badge: unreadCount > 0 ? `${unreadCount} baru` : null,
      icon: (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M2 4.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">
            Overview
          </p>
          <h1 className="text-3xl font-serif text-gray-900">
            Selamat datang, {session?.name?.split(' ')[0] ?? 'Admin'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Ringkasan konten holding, inisiatif sosial, dan inquiry pesan masuk.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-[#141414] hover:opacity-85 text-white text-xs font-medium px-4 py-2.5 rounded transition-opacity"
          >
            <span>+ Tulis Artikel</span>
          </Link>
          <Link
            href="/admin/social-impact/new"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-xs font-medium px-4 py-2.5 rounded transition-colors"
          >
            <span>+ Program Sosial</span>
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-gray-200 p-6 rounded hover:border-gray-300 hover:shadow-xs transition-all block group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-gray-400 group-hover:text-gray-900 transition-colors">
                {stat.icon}
              </div>
              {stat.badge && (
                <span className="bg-[#141414] text-white text-[10px] tracking-wide px-2 py-0.5 rounded font-medium">
                  {stat.badge}
                </span>
              )}
            </div>
            <div className="text-3xl font-serif text-gray-900 mb-1">{stat.value}</div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-gray-400">{stat.label}</div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>{stat.sub}</span>
              <span className="text-gray-900 group-hover:underline font-medium">{stat.action}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Split Grid: Recent Articles & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Articles (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400">Artikel Blog</p>
              <h2 className="text-base font-serif text-gray-900">Publikasi Terbaru</h2>
            </div>
            <Link
              href="/admin/blog"
              className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
            >
              Lihat semua →
            </Link>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {recentPosts.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                Belum ada artikel.
              </div>
            ) : (
              recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/blog/${post.id}/edit`}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors group block"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 overflow-hidden shrink-0 relative">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.titleId}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] font-serif">
                          WHG
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:underline">
                        {post.titleId}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded shrink-0 ${
                      post.published
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-gray-50 text-gray-400 border border-gray-200'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </Link>
              ))
            )}
          </div>

          <div className="px-6 py-3 border-t border-gray-100 text-xs">
            <Link
              href="/admin/blog/new"
              className="text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5"
            >
              <span>+ Tulis artikel baru</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Recent Messages (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400">Pesan Masuk</p>
              <h2 className="text-base font-serif text-gray-900">Inquiry Terbaru</h2>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
            >
              Lihat semua →
            </Link>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {recentMessages.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                Belum ada pesan masuk.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href="/admin/messages"
                  className="px-6 py-3.5 flex items-start gap-3 hover:bg-gray-50/70 transition-colors block"
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-transparent" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-xs truncate ${!msg.isRead ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                        {msg.name}
                      </p>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                        {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${!msg.isRead ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {msg.email}
                    </p>
                  </div>
                  {!msg.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#141414] mt-2 shrink-0" />
                  )}
                </Link>
              ))
            )}
          </div>

          <div className="px-6 py-3 border-t border-gray-100 text-xs">
            <Link
              href="/admin/messages"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Buka semua inbox pesan →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
