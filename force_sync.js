import './server/load-env.js';
import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not defined in environment.');
  process.exit(1);
}

async function main() {
  console.log('✨ Force-syncing database columns via Native PG Driver...');
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔗 Connected to database.');

    // Force-sync tables for Admin & Competitions
    const queries = [
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "personalityType" TEXT',
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "personalityEmoji" TEXT',
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "themeColor" TEXT',
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "personalityDesc" TEXT',
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "primaryTrait" TEXT',
      'ALTER TABLE "QuizResult" ADD COLUMN IF NOT EXISTS "learningStyle" TEXT DEFAULT \'\'',
      'ALTER TABLE "QuizResult" ADD COLUMN IF NOT EXISTS "workEnvironment" TEXT DEFAULT \'\'',
      'ALTER TABLE "QuizResult" ADD COLUMN IF NOT EXISTS "actionableAdvice" TEXT DEFAULT \'\'',
      
      // Create Competition Table
      `CREATE TABLE IF NOT EXISTS "Competition" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "formLink" TEXT NOT NULL,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      // Create Enrollment Table
      `CREATE TABLE IF NOT EXISTS "Enrollment" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "User"(id),
        "competitionId" TEXT NOT NULL REFERENCES "Competition"(id),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      'CREATE UNIQUE INDEX IF NOT EXISTS "Enrollment_userId_competitionId_key" ON "Enrollment"("userId", "competitionId")',

      // Create Notification Table
      `CREATE TABLE IF NOT EXISTS "Notification" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "User"(id),
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "read" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const q of queries) {
      console.log(`🚀 Executing: ${q.substring(0, 50)}...`);
      await client.query(q).catch(e => {
        if (e.code === '42701') {
          console.log('✅ Column/Table already exists.');
        } else {
          console.error(`❌ Query failed: ${e.message}`);
        }
      });
    }

    console.log('🎉 Database columns are now 100% in sync!');
  } catch (err) {
    console.error('❌ SQL Migration failed:', err);
  } finally {
    await client.end();
  }
}

main();
