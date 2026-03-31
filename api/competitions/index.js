import prisma from '../lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const competitions = await prisma.competition.findMany({
        where: { active: true },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json({ competitions });
    } catch (error) {
      console.error('CRITICAL COMPETITION FETCH ERROR:', error);
      res.status(500).json({ error: 'DB_SYNC_FAILURE', message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, formLink } = req.body;
      if (!title || !description || !formLink) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const competition = await prisma.competition.create({
        data: { 
          title, 
          description, 
          formLink: formLink.startsWith('http') ? formLink : `https://${formLink}`,
          active: true 
        }
      });
      res.status(201).json({ success: true, competition });
    } catch (error) {
      console.error('Publish error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
