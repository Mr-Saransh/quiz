import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Get platform stats
router.get('/', async (req, res) => {
  try {
    const [totalUsers, totalTests, recentTests] = await Promise.all([
      prisma.user.count(),
      prisma.quizResult.count(),
      prisma.quizResult.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24h
          },
        },
      }),
    ]);

    res.json({
      totalStudents: totalUsers,
      totalTestsTaken: totalTests,
      testsLast24h: recentTests,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
