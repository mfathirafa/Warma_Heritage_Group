import { prisma } from '../app/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    console.log('Connecting to database...');
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 25));
    const users = await prisma.user.findMany();
    console.log('Users in database:', users.length);
    for (const u of users) {
      console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Password length: ${u.password?.length}`);
      const testMatch = bcrypt.compareSync('AdminWarma2026!', u.password);
      console.log(`  Password match for AdminWarma2026!: ${testMatch}`);
    }
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
