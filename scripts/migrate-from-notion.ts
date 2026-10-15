import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local first, then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { getBlogPosts, getSocialImpacts } from '../app/lib/notion';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting migration & seed...');

  // 1. Seed Admin User
  const adminEmail = 'admin@warmaheritagegroup.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('AdminWarma2026!', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin user created: ${admin.email}`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${existingAdmin.email}`);
  }

  // 2. Migrate Posts from Notion
  console.log('📥 Fetching posts from Notion...');
  try {
    const posts = await getBlogPosts();
    console.log(`Found ${posts.length} posts in Notion.`);

    for (const post of posts) {
      if (!post.slug) continue;
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: {
          titleId: post.titleId,
          titleEn: post.titleEn,
          excerptId: post.excerptId,
          excerptEn: post.excerptEn,
          contentId: post.contentId,
          contentEn: post.contentEn,
          category: post.category || 'Berita',
          coverImage: post.cover,
          published: post.status === 'Published',
          publishedAt: post.date ? new Date(post.date) : new Date(),
        },
        create: {
          slug: post.slug,
          titleId: post.titleId,
          titleEn: post.titleEn,
          excerptId: post.excerptId,
          excerptEn: post.excerptEn,
          contentId: post.contentId,
          contentEn: post.contentEn,
          category: post.category || 'Berita',
          coverImage: post.cover,
          published: post.status === 'Published',
          publishedAt: post.date ? new Date(post.date) : new Date(),
        },
      });
      console.log(`  ✓ Post synced: ${post.slug}`);
    }
  } catch (err: any) {
    console.warn(`⚠️ Warning fetching posts from Notion:`, err.message);
  }

  // 3. Migrate Social Impacts from Notion
  console.log('📥 Fetching Social Impacts from Notion...');
  try {
    const impacts = await getSocialImpacts();
    console.log(`Found ${impacts.length} social impacts in Notion.`);

    for (const impact of impacts) {
      await prisma.socialImpact.create({
        data: {
          titleId: impact.titleId,
          titleEn: impact.titleEn,
          descId: impact.descId,
          descEn: impact.descEn,
          categoryId: impact.categoryId,
          categoryEn: impact.categoryEn,
          coverImage: impact.cover,
          order: impact.order ?? 0,
          published: true,
        },
      });
      console.log(`  ✓ Social Impact synced: ${impact.titleId}`);
    }
  } catch (err: any) {
    console.warn(`⚠️ Warning fetching social impacts from Notion:`, err.message);
  }

  console.log('✨ Migration and seed finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
