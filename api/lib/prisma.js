import { PrismaClient } from '@prisma/client';

let prisma;

const options = {
  datasourceUrl: process.env.DATABASE_URL
};

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(options);
} else {
  if (!globalThis._prisma) {
    globalThis._prisma = new PrismaClient(options);
  }
  prisma = globalThis._prisma;
}

export default prisma;
