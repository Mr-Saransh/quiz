import prisma from '../../../lib/prisma.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    const results = await prisma.quizResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      results: results.map((r) => ({
        ...r,
        categoryScores: JSON.parse(r.categoryScores),
        topStrengths: JSON.parse(r.topStrengths || '[]'),
        areasToImprove: JSON.parse(r.areasToImprove || '[]'),
        skillPlan: JSON.parse(r.skillPlan || '[]'),
        careers: JSON.parse(r.careers),
        answers: JSON.parse(r.answers),
      })),
    });
  } catch (error) {
    console.error('Get user results error:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
}
