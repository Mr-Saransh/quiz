import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Get all published courses
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { enrollments: true, lessons: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ courses });
  } catch (error) {
    console.error('Fetch courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get user's enrolled courses
router.get('/enrolled', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            },
            _count: {
              select: { lessons: true }
            }
          }
        }
      }
    });
    res.json({ enrolledCourses: enrollments.map(e => e.course) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single course by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { enrollments: true, lessons: true }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Fetch course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Enroll in a course
router.post('/:id/enroll', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const enrollment = await prisma.courseEnrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: id
        }
      },
      update: {},
      create: {
        userId,
        courseId: id
      }
    });
    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
