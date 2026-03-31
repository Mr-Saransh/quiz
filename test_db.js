import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;
const DATABASE_URL = "postgres://5885a2c9237fe51efcd5674153d4e478608808039744e1358f0a6ddca68f0ada:sk_YF2uzfTFiDGgi2B2-kjdr@db.prisma.io:5432/postgres?sslmode=require";

async function main() {
  console.log('Testing connection to:', DATABASE_URL.substring(0, 50) + '...');
  
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const userCount = await prisma.user.count();
    console.log('Successfully connected! User count:', userCount);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
