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
    const users = await prisma.user.findMany({
      select: { name: true, contact: true, ageClass: true, city: true, address: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    // Convert to CSV
    let csv = 'Name,Phone/Contact,Age/Class,City,Address,Joined At\n';
    users.forEach((u) => {
      const escape = (str) => `"${(str || '').replace(/"/g, '""')}"`;
      const dateStr = u.createdAt ? new Date(u.createdAt).toLocaleString() : '';
      csv += `${escape(u.name)},${escape(u.contact)},${escape(u.ageClass)},${escape(u.city)},${escape(u.address)},${escape(dateStr)}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="apnividya_users.csv"');
    return res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export users' });
  }
}
