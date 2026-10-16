import { PrismaClient } from '@prisma/client';

// Fallback dummy connection string for build time or CI where DATABASE_URL is not injected yet
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mysql://build_dummy:build_dummy@localhost:3306/build_dummy';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

