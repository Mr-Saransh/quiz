import { Router } from 'express';
import prisma from '../db.js';
import nodemailer from 'nodemailer';

const router = Router();

// Setup Nodemailer transporter
let transporter;
async function getTransporter() {
  if (transporter) return transporter;
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate a test ethereal account if no SMTP provided
    console.log('No SMTP credentials found, creating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  return transporter;
}

// Register / Login user without OTP
router.post('/register-basic', async (req, res) => {
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
});



// Set user profile (after registration or from dashboard)
router.put('/set-profile', async (req, res) => {
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
    if (profileImage !== undefined) updateData.profileImage = profileImage; // allow clearing image

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
});

// Get user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId || userId === 'undefined' || userId === 'null') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        ageClass: true,
        city: true,
        address: true,
        profileImage: true,
        contact: true,
        authMode: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Admin Export Users
router.get('/admin/export-users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { name: true, contact: true, ageClass: true, city: true, address: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    
    // Convert to CSV
    let csv = 'Name,Phone/Contact,Age/Class,City,Address,Joined At\n';
    users.forEach(u => {
      const escape = (str) => `"${(str || '').replace(/"/g, '""')}"`;
      const dateStr = u.createdAt ? new Date(u.createdAt).toLocaleString() : '';
      csv += `${escape(u.name)},${escape(u.contact)},${escape(u.ageClass)},${escape(u.city)},${escape(u.address)},${escape(dateStr)}\n`;
    });
    
    res.header('Content-Type', 'text/csv');
    res.attachment('apnividya_users.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export users' });
  }
});

export default router;
