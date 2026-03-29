import prisma from '../../lib/prisma.js';

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
    const { id } = req.query;

    const result = await prisma.quizResult.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    });

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json({
      result: {
        ...result,
        categoryScores: JSON.parse(result.categoryScores),
        topStrengths: JSON.parse(result.topStrengths || '[]'),
        areasToImprove: JSON.parse(result.areasToImprove || '[]'),
        skillPlan: JSON.parse(result.skillPlan || '[]'),
        careers: JSON.parse(result.careers),
        answers: JSON.parse(result.answers),
        userName: result.user?.name || 'Anonymous',
      },
    });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({ error: 'Failed to get result' });
  }
}
