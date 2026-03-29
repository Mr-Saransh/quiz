import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const { period } = req.query; // 'today', 'weekly', 'monthly'

    let dateFilter = {};
    const now = new Date();

    if (period === 'today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = { createdAt: { gte: start } };
    } else if (period === 'weekly') {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      dateFilter = { createdAt: { gte: start } };
    } else {
      // monthly (default)
      const start = new Date(now);
      start.setDate(start.getDate() - 30);
      dateFilter = { createdAt: { gte: start } };
    }

    // Get best score per user within the time period
    const results = await prisma.quizResult.findMany({
      where: dateFilter,
      orderBy: { totalScore: 'desc' },
      include: { user: { select: { id: true, name: true } } },
      take: 100,
    });

    // Deduplicate by user — keep highest score
    const seen = new Set();
    const leaderboard = [];
    for (const r of results) {
      if (!seen.has(r.userId)) {
        seen.add(r.userId);
        leaderboard.push({
          userId: r.userId,
          name: r.user?.name || 'Anonymous',
          score: r.totalScore,
          personality: r.personalityType,
          date: r.createdAt.toISOString(),
        });
      }
      if (leaderboard.length >= 20) break;
    }

    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

export default router;
