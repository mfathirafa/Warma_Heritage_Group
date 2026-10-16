import type { Metadata } from 'next';
import SocialImpactFormClient from '../components/SocialImpactFormClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Program Baru' };

export default function NewSocialImpactPage() {
  return <SocialImpactFormClient mode="create" />;
}
