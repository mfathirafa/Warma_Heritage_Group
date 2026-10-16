import type { Metadata } from 'next';
import BlogFormClient from '../components/BlogFormClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Artikel Baru' };

export default function NewBlogPage() {
  return <BlogFormClient mode="create" />;
}
