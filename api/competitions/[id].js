import prisma from '../lib/prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    // We do a soft delete to preserve historical records
    await prisma.competition.update({
      where: { id },
      data: { active: false }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
}
