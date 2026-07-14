import { getSocialImpacts } from './lib/notion';
import HomeClient from './HomeClient';

export const revalidate = 60;

export default async function Home() {
  const socialImpacts = await getSocialImpacts();
  return <HomeClient socialImpacts={socialImpacts} />;
}