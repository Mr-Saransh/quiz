import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Get all active competitions
router.get('/', async (req, res) => {
  try {
    const competitions = await prisma.competition.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ competitions });
  } catch (error) {
    console.error('CRITICAL COMPETITION FETCH ERROR:', error);
    res.status(500).json({ error: 'DB_SYNC_FAILURE', message: error.message });
  }
});

// Admin: Add a new competition
router.post('/', async (req, res) => {
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
    res.json({ success: true, competition });
  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Remove competition (Soft Delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // We do a soft delete to preserve historical records
    await prisma.competition.update({
      where: { id },
      data: { active: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User: Enroll in a competition
router.post('/:id/enroll', async (req, res) => {
  try {
    const { id } = req.params;
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

    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
