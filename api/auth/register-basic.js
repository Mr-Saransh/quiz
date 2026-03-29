import prisma from '../lib/prisma.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, ageClass, contact } = req.body;

    if (!name || !ageClass || !contact) {
      return res.status(400).json({ error: 'Name, Class/Age, and Contact are required' });
    }

    // Determine authMode via regex
    const authMode = /^[0-9+\-\s()]+$/.test(contact) ? 'mobile' : 'email';

    // Upsert user logic based on contact
    const user = await prisma.user.upsert({
      where: { contact },
      update: { name, ageClass, authMode },
      create: { name, ageClass, contact, authMode },
    });

    res.json({
      success: true,
      message: 'User entered successfully',
      user: {
        id: user.id,
        name: user.name,
        ageClass: user.ageClass,
        city: user.city,
        address: user.address,
        profileImage: user.profileImage,
        contact: user.contact,
        authMode: user.authMode,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Basic register error:', error);
    res.status(500).json({ error: 'Failed to access application' });
  }
}
