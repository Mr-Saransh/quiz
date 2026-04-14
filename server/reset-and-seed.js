// Reset user data (keep courses/lessons) and seed 3 IITian mentors
import './load-env.js';
import prisma from './db.js';

async function main() {
  console.log('🔄 Starting data reset...\n');

  // 1. Delete user-related data (order matters for FKs)
  const delNotif = await prisma.notification.deleteMany({});
  console.log(`  ✅ Deleted ${delNotif.count} notifications`);

  const delCoupon = await prisma.couponAttempt.deleteMany({});
  console.log(`  ✅ Deleted ${delCoupon.count} coupon attempts`);

  const delCourseEnroll = await prisma.courseEnrollment.deleteMany({});
  console.log(`  ✅ Deleted ${delCourseEnroll.count} course enrollments`);

  const delEnroll = await prisma.enrollment.deleteMany({});
  console.log(`  ✅ Deleted ${delEnroll.count} event enrollments`);

  const delResults = await prisma.quizResult.deleteMany({});
  console.log(`  ✅ Deleted ${delResults.count} quiz results`);

  const delUsers = await prisma.user.deleteMany({});
  console.log(`  ✅ Deleted ${delUsers.count} users`);

  console.log('\n✅ All user data cleared! Courses & lessons preserved.\n');

  // 2. Clear existing mentors and seed 3 fresh ones
  await prisma.mentor.deleteMany({});
  console.log('  🗑️  Cleared existing mentors');

  const mentors = await Promise.all([
    prisma.mentor.create({
      data: {
        name: 'Arjun Sharma',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        description: 'Full-stack developer & AI researcher with 5+ years of experience at Google. Passionate about making complex tech concepts accessible to everyone.',
        iitBranch: 'IIT Delhi — Computer Science',
        order: 1
      }
    }),
    prisma.mentor.create({
      data: {
        name: 'Priya Patel',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
        description: 'Cybersecurity expert & fintech consultant. Led security audits for 20+ startups. Believes in empowering students with digital safety and financial literacy.',
        iitBranch: 'IIT Bombay — Electrical Engineering',
        order: 2
      }
    }),
    prisma.mentor.create({
      data: {
        name: 'Rohan Mehta',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
        description: 'Communication coach & soft-skills trainer. Ex-McKinsey analyst who now helps students build leadership, teamwork, and presentation skills.',
        iitBranch: 'IIT Kanpur — Mechanical Engineering',
        order: 3
      }
    })
  ]);

  console.log(`  ✅ Seeded ${mentors.length} IITian mentors:`);
  mentors.forEach(m => console.log(`     → ${m.name} (${m.iitBranch})`));

  console.log('\n🎉 Reset complete! Fresh start ready.\n');
}

main()
  .catch(e => { console.error('❌ Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
