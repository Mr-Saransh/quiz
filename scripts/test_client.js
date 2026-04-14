import prisma from '../server/db.js';

async function main() {
  console.log('User fields:', Object.keys(prisma.user.fields || {}).length ? Object.keys(prisma.user.fields) : 'Fields not exposed directly on this version of client');
  
  // Try a dry run of findFirst with password select
  try {
    await prisma.user.findFirst({
        select: { password: true }
    });
    console.log('✅ Client correctly recognizes the password field.');
  } catch (e) {
    console.error('❌ Client error:', e.message);
  }
}

main().finally(() => prisma.$disconnect());
