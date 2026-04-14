import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Get all mentors (public)
router.get('/', async (req, res) => {
  try {
    const mentors = await prisma.mentor.findMany({
      orderBy: { order: 'asc' }
    });
    res.json({ mentors });
  } catch (error) {
    console.error('Fetch mentors error:', error);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

export default router;
