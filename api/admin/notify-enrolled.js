import prisma from '../lib/prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json({ success: true, count: notifications.length });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: error.message });
  }
}
