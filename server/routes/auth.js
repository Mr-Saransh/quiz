import { Router } from 'express';
import prisma from '../db.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

const router = Router();

// Setup Nodemailer transporter
let transporter;
// Use credentials from .env
async function getTransporter() {
  if (transporter) return transporter;
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASSWORD || '').trim();

  if (user && pass) {
    console.log(`Attempting to use Gmail SMTP for ${user}...`);
    const tempTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
    
    try {
      await tempTransporter.verify();
      console.log('✅ SMTP connection verified successfully');
      transporter = tempTransporter;
    } catch (err) {
      console.error('❌ SMTP Connection failed:', err.message);
      console.log('Falling back to Ethereal test account...');
      transporter = null;
    }
  }

  if (!transporter) {
    console.log('Creating Ethereal test account...');
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
    console.log(`✅ Ethereal account created: ${testAccount.user}`);
  }
  return transporter;
}



// Request Email OTP
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔑 [OTP DEBUG] Code for ${email}: ${code}`);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins


    // Store OTP in database
    await prisma.otp.create({
      data: { email, code, expiresAt }
    });

    const mailOptions = {
      from: `"Find Your Spark" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔑 ${code} is your Find Your Spark verification code`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background-color: #f8fafc; color: #1e293b;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Find Your Spark</h1>
            </div>
            <div style="padding: 40px 30px; text-align: center;">
              <p style="margin-top: 0; font-size: 16px; line-height: 1.6; color: #475569;">Hello! Use the following code to verify your account and start your journey.</p>
              <div style="margin: 30px 0; padding: 20px; background-color: #f1f5f9; border-radius: 12px; border: 1px dashed #cbd5e1; display: inline-block;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 0.25em; color: #4338ca; font-family: 'Courier New', Courier, monospace;">${code}</span>
              </div>
              <p style="margin-bottom: 0; font-size: 14px; color: #64748b;">This code will expire in 5 minutes for your security.</p>
            </div>
            <div style="padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; background-color: #f8fafc;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} Find Your Spark. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    };


    const mailer = await getTransporter();
    const info = await mailer.sendMail(mailOptions);
    
    const testUrl = nodemailer.getTestMessageUrl(info);
    if (testUrl) {
      console.log(`🔗 Test Email URL: ${testUrl}`);
    }

    res.json({ success: true, message: 'OTP sent to email', testUrl });
  } catch (error) {

    console.error('SERVER OTP REQUEST ERROR:', error);
    res.status(500).json({ error: `Failed to send OTP: ${error.message}` });
  }
});


// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const otpRecord = await prisma.otp.findFirst({
      where: { email, code, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' }
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Delete used/expired OTPs for this email to cleanup
    await prisma.otp.deleteMany({ where: { email } });

    res.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Register / Login user after OTP success
router.post('/register-basic', async (req, res) => {
  try {
    const { name, age, studentClass, contact, email } = req.body;
    
    if (!name || !age || !studentClass || !contact || !email) {
      return res.status(400).json({ error: 'All fields are required (Name, Age, Class, Phone, Email)' });
    }

    const authMode = 'email'; // We are switching to email-based OTP

    // 1. Try to find by email
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // 2. Update existing user (found by email)
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name, age, studentClass, contact, authMode, ageClass: `${age} | Class ${studentClass}` }
      });
    } else {
      // 3. If not found by email, check if contact is already taken by someone else
      const existingWithPhone = await prisma.user.findUnique({ where: { contact } });
      if (existingWithPhone) {
        // Option A: Update that user (effectively linking this email to that phone)
        // Option B: Error out. Let's go with B if the user expects one email per phone.
        // But the requester said "login via password setup AFTER sign in via otp", 
        // implying account recovery/migration is possible.
        // To be safe, let's update that user to use the new email.
        user = await prisma.user.update({
          where: { id: existingWithPhone.id },
          data: { name, age, studentClass, email, authMode, ageClass: `${age} | Class ${studentClass}` }
        });
      } else {
        // 4. Truly new user
        user = await prisma.user.create({
          data: { name, age, studentClass, contact, email, authMode, ageClass: `${age} | Class ${studentClass}` }
        });
      }
    }

    res.json({
      success: true,
      message: 'User logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        age: user.age,
        studentClass: user.studentClass,
        contact: user.contact,
        email: user.email,
        authMode: user.authMode,
        createdAt: user.createdAt,
        hasPassword: !!user.password
      },
    });
  } catch (error) {
    console.error('Basic register error DETAILS:', error);
    res.status(500).json({ error: `Failed to access application: ${error.message}` });
  }
});

// Set password (after OTP verification)
router.post('/set-password', async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ error: 'User ID and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ success: true, message: 'Password set successfully' });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ error: 'Failed to set password' });
  }
});

// Login with password
router.post('/login-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        age: user.age,
        studentClass: user.studentClass,
        ageClass: user.ageClass,
        contact: user.contact,
        email: user.email,
        authMode: user.authMode,
        createdAt: user.createdAt,
        hasPassword: true
      }
    });
  } catch (error) {
    console.error('Password login error:', error);
    res.status(500).json({ error: 'Login failed' });
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
        age: user.age,
        studentClass: user.studentClass,
        ageClass: user.ageClass,
        city: user.city,
        address: user.address,
        profileImage: user.profileImage,
        contact: user.contact,
        email: user.email,
        authMode: user.authMode,
        createdAt: user.createdAt,
        personalityType: user.personalityType,
        personalityEmoji: user.personalityEmoji,
        themeColor: user.themeColor,
        personalityDesc: user.personalityDesc,
        primaryTrait: user.primaryTrait,
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
        age: true,
        studentClass: true,
        ageClass: true,
        city: true,
        address: true,
        profileImage: true,
        contact: true,
        email: true,
        authMode: true,
        createdAt: true,
        personalityType: true,
        personalityEmoji: true,
        themeColor: true,
        personalityDesc: true,
        primaryTrait: true,
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

// Get user notifications
router.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ notifications });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
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
