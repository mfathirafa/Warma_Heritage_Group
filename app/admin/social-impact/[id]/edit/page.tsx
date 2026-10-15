import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SocialImpactFormClient from '../../components/SocialImpactFormClient';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: 'Edit Program' };

export default async function EditSocialImpactPage({ params }: Props) {
  const { id } = await params;
  const item = await prisma.socialImpact.findUnique({ where: { id: Number(id) } });

  if (!item) notFound();

  return (
    <SocialImpactFormClient
      mode="edit"
      itemId={item.id}
      defaultValues={{
        titleId: item.titleId,
        titleEn: item.titleEn ?? '',
        descId: item.descId,
        descEn: item.descEn ?? '',
        categoryId: item.categoryId ?? '',
        categoryEn: item.categoryEn ?? '',
        coverImage: item.coverImage ?? '',
        order: item.order,
        published: item.published,
      }}
    />
  );
}
