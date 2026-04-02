import prisma from './server/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const courses = await prisma.course.findMany();
    console.log('Courses found:', courses.length);
  } catch (e) {
    console.error('DB ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
