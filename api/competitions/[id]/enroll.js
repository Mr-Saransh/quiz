import prisma from '../../lib/prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query; // id is competitionId
    const { userId } = req.body;
    
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_competitionId: {
          userId,
          competitionId: id
        }
      },
      update: {}, // Do nothing if already enrolled
      create: {
        userId,
        competitionId: id
      }
    });

    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: error.message });
  }
}
