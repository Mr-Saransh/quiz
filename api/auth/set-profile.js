import prisma from '../lib/prisma.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, name, ageClass, city, address, profileImage } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (ageClass) updateData.ageClass = ageClass;
    if (city !== undefined) updateData.city = city;
    if (address !== undefined) updateData.address = address;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({
      success: true,
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
    console.error('Set profile error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
}
