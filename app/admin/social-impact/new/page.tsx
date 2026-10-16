import type { Metadata } from 'next';
import { prisma } from '@/app/lib/prisma';
import { connection } from 'next/server';
import SocialImpactFormClient from '../components/SocialImpactFormClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Program Baru' };

export default async function NewSocialImpactPage() {
  await connection();
  let nextOrder = 1;
  try {
    const highest = await prisma.socialImpact.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    if (highest) {
      nextOrder = highest.order + 1;
    }
  } catch (error) {
    console.error('Failed to calculate next order:', error);
  }

  return <SocialImpactFormClient mode="create" defaultValues={{ order: nextOrder }} />;
}
