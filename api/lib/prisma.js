import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;

let prisma;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const options = { adapter };

if (process.env.NODE_ENV === 'production') {
  console.log('[PRISMA] Initializing in production...')
  if (!process.env.DATABASE_URL) {
    console.error('[PRISMA] CRITICAL ERROR: DATABASE_URL is missing in environment!');
  } else {
    try {
      const url = new URL(process.env.DATABASE_URL);
      console.log(`[PRISMA] Database Host: ${url.host}`);
    } catch (e) {
      console.error('[PRISMA] Invalid DATABASE_URL format.');
    }
  }
  prisma = new PrismaClient(options);
} else {
  if (!globalThis._prisma) {
    globalThis._prisma = new PrismaClient(options);
  }
  prisma = globalThis._prisma;
}

export default prisma;
