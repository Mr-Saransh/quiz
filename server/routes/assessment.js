import { Router } from 'express';
import crypto from 'crypto';
import prisma from '../db.js';

const router = Router();

// Check if phone number already took the assessment
router.get('/check/:phone', async (req, res) => {
  const { phone } = req.params;
  try {
    const existing = await prisma.couponAttempt.findUnique({
      where: { phone }
    });
    if (existing) {
      return res.json({ attempted: true, couponCode: existing.couponCode });
    }
    res.json({ attempted: false });
  } catch (error) {
    console.error('Assessment check error:', error);
    res.status(500).json({ error: 'Failed to check assessment status' });
  }
});

// Submit assessment and generate coupon
router.post('/submit', async (req, res) => {
  const { phone, score, totalQuestions } = req.body;

  if (!phone || score === undefined) {
    return res.status(400).json({ error: 'Phone and score are required' });
  }

  try {
    // Double-check no existing attempt
    const existing = await prisma.couponAttempt.findUnique({
      where: { phone }
    });
    if (existing) {
      return res.status(409).json({ 
        error: 'Assessment already completed',
        couponCode: existing.couponCode 
      });
    }

    // Generate unique coupon code
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    const couponCode = `VIDYA-${randomPart}`;

    const attempt = await prisma.couponAttempt.create({
      data: {
        phone,
        couponCode,
        score: parseInt(score)
      }
    });

    res.json({ 
      success: true, 
      couponCode: attempt.couponCode,
      score: attempt.score,
      totalQuestions
    });
  } catch (error) {
    console.error('Assessment submit error:', error);
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

// Verify a coupon code
router.post('/verify-coupon', async (req, res) => {
  const { couponCode } = req.body;

  if (!couponCode) {
    return res.status(400).json({ error: 'Coupon code is required' });
  }

  try {
    const attempt = await prisma.couponAttempt.findUnique({
      where: { couponCode: couponCode.trim().toUpperCase() }
    });

    if (!attempt) {
      return res.json({ valid: false, message: 'Invalid coupon code' });
    }

    if (attempt.used) {
      return res.json({ valid: false, message: 'Coupon already used' });
    }

    res.json({ 
      valid: true, 
      discount: 3000,
      message: 'Coupon applied! ₹3,000 discount' 
    });
  } catch (error) {
    console.error('Coupon verify error:', error);
    res.status(500).json({ error: 'Failed to verify coupon' });
  }
});

export default router;
