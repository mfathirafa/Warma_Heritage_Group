import { prisma } from '@/app/lib/prisma';
import { getSession } from '@/app/lib/session';
import { connection } from 'next/server';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  await connection();
  const session = await getSession();

  let postCount = 0;
  let publishedPostCount = 0;
  let socialImpactCount = 0;
  let messageCount = 0;
  let unreadCount = 0;
  let recentPosts: Array<{
    id: number;
    titleId: string;
    slug: string;
    published: boolean;
    createdAt: Date;
    category: string;
    coverImage: string | null;
  }> = [];
  let recentMessages: Array<{
    id: number;
    name: string;
    email: string;
    subject: string;
    isRead: boolean;
    createdAt: Date;
    company: string | null;
  }> = [];

  try {
    const [posts, pubPosts, impacts, messages, unread] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.socialImpact.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);
    postCount = posts;
    publishedPostCount = pubPosts;
    socialImpactCount = impacts;
    messageCount = messages;
    unreadCount = unread;

    recentPosts = await prisma.post.findMany({
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

    recentMessages = await prisma.contactMessage.findMany({
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
  } catch (error) {
    console.error('[AdminDashboardPage] Error fetching dashboard data:', error);
  }

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
      sub: messageCount === 0
        ? 'Belum ada pesan masuk'
        : unreadCount > 0
        ? `${unreadCount} belum dibaca`
        : 'Semua sudah dibaca',
      href: '/admin/messages',
      action: 'Buka Kotak Masuk →',
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
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-1">
            Ikhtisar
          </p>
          <h1 className="text-3xl font-serif text-gray-900">
            Selamat datang, {session?.name || 'Administrator'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Ringkasan narasi holding, program dampak sosial CSR, dan inquiry kemitraan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-[#141414] hover:bg-black text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <span>+ Tulis Artikel</span>
          </Link>
          <Link
            href="/admin/social-impact/new"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-xs font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
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
            className="bg-white border border-gray-200/90 p-6 rounded-xl hover:border-gray-300 hover:shadow-md transition-all block group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-gray-500 group-hover:text-gray-900 transition-colors">
                {stat.icon}
              </div>
              {stat.badge && (
                <span className="bg-[#141414] text-white text-[10px] tracking-wide px-2.5 py-0.5 rounded-full font-medium lining-nums">
                  {stat.badge}
                </span>
              )}
            </div>
            <div className="text-3xl font-serif text-gray-900 mb-1 lining-nums font-semibold">{stat.value}</div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-gray-500 font-medium">{stat.label}</div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="lining-nums">{stat.sub}</span>
              <span className="text-gray-900 group-hover:underline font-medium">{stat.action}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Split Grid: Recent Articles & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Articles (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200/90 rounded-xl flex flex-col overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500 font-medium">Artikel Blog</p>
              <h2 className="text-base font-serif text-gray-900">Publikasi Terbaru</h2>
            </div>
            <Link
              href="/admin/blog"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Lihat semua →
            </Link>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {recentPosts.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <line x1="4.5" y1="5.5" x2="11.5" y2="5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-700">Belum ada artikel</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Artikel yang Anda tulis akan muncul di sini.</p>
              </div>
            ) : (
              recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/blog/${post.id}/edit`}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors group block"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 relative">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.titleId}
                          fill
                          unoptimized
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
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span className="lining-nums">
                          {new Date(post.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full shrink-0 font-medium ${
                      post.published
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {post.published ? 'Terbit' : 'Draf'}
                  </span>
                </Link>
              ))
            )}
          </div>

          <div className="px-6 py-3 border-t border-gray-100 text-xs bg-gray-50/30">
            <Link
              href="/admin/blog/new"
              className="text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              <span>+ Tulis artikel baru</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Recent Messages (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200/90 rounded-xl flex flex-col overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500 font-medium">Pesan Masuk</p>
              <h2 className="text-base font-serif text-gray-900">Inquiry Terbaru</h2>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Lihat semua →
            </Link>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {recentMessages.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M2 4.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-700">Belum ada pesan masuk</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Pesan dari form kontak website akan tampil di sini.</p>
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
                      <p className={`text-xs truncate ${!msg.isRead ? 'font-bold text-gray-950' : 'text-gray-600'}`}>
                        {msg.name}
                      </p>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-2 lining-nums">
                        {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${!msg.isRead ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {msg.email}
                    </p>
                  </div>
                  {!msg.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0 animate-pulse" />
                  )}
                </Link>
              ))
            )}
          </div>

          <div className="px-6 py-3 border-t border-gray-100 text-xs bg-gray-50/30">
            <Link
              href="/admin/messages"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Buka semua inbox pesan →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
