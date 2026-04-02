import prisma from '../server/db.js';

async function main() {
  try {
    const courses = await prisma.course.findMany({
      select: { id: true, title: true }
    });
    console.log('Available Course IDs:');
    console.log(JSON.stringify(courses, null, 2));
  } catch (error) {
    console.error('Database Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
