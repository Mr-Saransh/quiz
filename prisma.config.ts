import { defineConfig } from '@prisma/config';
import { PrismaClient } from '@prisma/client';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL
  }
});
