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

export default router;
