import prisma from '../server/db.js';

async function main() {
  console.log('🗑️  Resetting all user data...');

  // Delete in order of dependencies
  const delQuizResults = await prisma.quizResult.deleteMany({});
  console.log(`- Deleted ${delQuizResults.count} quiz results`);

  const delEnrollments = await prisma.enrollment.deleteMany({});
  console.log(`- Deleted ${delEnrollments.count} competition enrollments`);

  const delCourseEnrollments = await prisma.courseEnrollment.deleteMany({});
  console.log(`- Deleted ${delCourseEnrollments.count} course enrollments`);

  const delNotifications = await prisma.notification.deleteMany({});
  console.log(`- Deleted ${delNotifications.count} notifications`);

  const delUsers = await prisma.user.deleteMany({});
  console.log(`- Deleted ${delUsers.count} users`);

  const delCoupons = await prisma.couponAttempt.deleteMany({});
  console.log(`- Deleted ${delCoupons.count} coupon attempts`);

  const delOtps = await prisma.otp.deleteMany({});
  console.log(`- Deleted ${delOtps.count} OTP records`);

  console.log('✅ All user data has been reset.');
}

main()
  .catch(e => {
    console.error('❌ Reset failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
