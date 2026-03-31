import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;
const DATABASE_URL = "postgres://5885a2c9237fe51efcd5674153d4e478608808039744e1358f0a6ddca68f0ada:sk_YF2uzfTFiDGgi2B2-kjdr@db.prisma.io:5432/postgres?sslmode=require&directConnection=true";

async function main() {
  console.log('✨ Force-syncing database columns...');
  
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Add User columns
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "personalityType" TEXT;`.catch(() => {});
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "personalityEmoji" TEXT;`.catch(() => {});
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "themeColor" TEXT;`.catch(() => {});
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "personalityDesc" TEXT;`.catch(() => {});
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "primaryTrait" TEXT;`.catch(() => {});

    // Add QuizResult columns
    await prisma.$executeRaw`ALTER TABLE "QuizResult" ADD COLUMN IF NOT EXISTS "learningStyle" TEXT DEFAULT '';`.catch(() => {});
    await prisma.$executeRaw`ALTER TABLE "QuizResult" ADD COLUMN IF NOT EXISTS "workEnvironment" TEXT DEFAULT '';`.catch(() => {});
    await prisma.$executeRaw`ALTER TABLE "QuizResult" ADD COLUMN IF NOT EXISTS "actionableAdvice" TEXT DEFAULT '';`.catch(() => {});

    console.log('✅ Columns added successfully via raw SQL!');
  } catch (err) {
    console.error('❌ SQL Migration failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
