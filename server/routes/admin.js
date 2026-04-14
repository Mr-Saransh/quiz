import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Fixed Admin Credentials
const ADMIN_ID = 'admin';
const ADMIN_PASS = 'admin@apni123';

// Admin Login
router.post('/login', (req, res) => {
  const { id, password } = req.body;
  if (id === ADMIN_ID && password === ADMIN_PASS) {
    // In a real app we'd use JWT, but for simplicity here we return success
    // The frontend will store a flag in localStorage
    return res.json({ success: true, token: 'admin-secret-token' });
  }
  res.status(401).json({ error: 'Invalid admin credentials' });
});

// Admin: Send alert to users enrolled in a specific competition
router.post('/notify-enrolled', async (req, res) => {
  try {
    const { competitionId, title, message } = req.body;
    
    if (!competitionId || !title || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get all users enrolled in this competition
    const enrollments = await prisma.enrollment.findMany({
      where: { competitionId },
      include: { user: true }
    });

    if (enrollments.length === 0) {
      return res.status(404).json({ error: 'No users enrolled in this competition' });
    }

    // Create notifications for each user
    const notifications = await Promise.all(
      enrollments.map(e => 
        prisma.notification.create({
          data: {
            userId: e.userId,
            title: title,
            message: message
          }
        })
      )
    );

    res.json({ success: true, count: notifications.length });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: { orderBy: { order: 'asc' } },
        _count: {
          select: { lessons: true, enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Create/Update course
router.post('/courses', async (req, res) => {
  try {
    const { id, title, description, thumbnail, price, published } = req.body;
    
    if (id) {
      // Update
      const course = await prisma.course.update({
        where: { id },
        data: { title, description, thumbnail, price, published }
      });
      return res.json(course);
    } else {
      // Create
      const course = await prisma.course.create({
        data: { title, description, thumbnail, price, published }
      });
      return res.json(course);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete course
router.delete('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Manage Lessons
router.post('/lessons', async (req, res) => {
  const { id, courseId, title, description, content, youtubeVideoId, order } = req.body;
  try {
    if (id) {
      const lesson = await prisma.lesson.update({
        where: { id },
        data: { title, description, content, youtubeVideoId, order: parseInt(order) || 0 }
      });
      res.json(lesson);
    } else {
      const lesson = await prisma.lesson.create({
        data: { courseId, title, description, content, youtubeVideoId, order: parseInt(order) || 0 }
      });
      res.status(201).json(lesson);
    }
  } catch (error) {
    console.error('Lesson Upsert Error:', error);
    res.status(500).json({ error: 'Failed to save lesson' });
  }
});

router.delete('/lessons/:id', async (req, res) => {
  try {
    await prisma.lesson.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// ===== MENTOR MANAGEMENT =====

// Admin: Get all mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await prisma.mentor.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Create/Update mentor
router.post('/mentors', async (req, res) => {
  try {
    const { id, name, photo, description, iitBranch, order } = req.body;
    
    if (id) {
      const mentor = await prisma.mentor.update({
        where: { id },
        data: { name, photo, description, iitBranch, order: parseInt(order) || 0 }
      });
      return res.json(mentor);
    } else {
      const mentor = await prisma.mentor.create({
        data: { name, photo, description, iitBranch, order: parseInt(order) || 0 }
      });
      return res.status(201).json(mentor);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete mentor
router.delete('/mentors/:id', async (req, res) => {
  try {
    await prisma.mentor.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete mentor' });
  }
});

export default router;

