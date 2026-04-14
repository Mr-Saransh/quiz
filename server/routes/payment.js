import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../db.js';
import { sendPurchaseConfirmation } from '../utils/email.js';

const router = Router();

// Initialize Razorpay
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('\u274c CRITICAL: Razorpay keys are missing in .env');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay Order
router.post('/order', async (req, res) => {
  const { courseId, userId, couponCode } = req.body;

  if (!courseId || !userId) {
    return res.status(400).json({ error: 'courseId and userId are required' });
  }

  try {
    // 1. Fetch course to verify price
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // 2. Calculate final price (with optional coupon discount)
    let finalPrice = course.price;
    let appliedCoupon = null;

    if (couponCode) {
      const couponAttempt = await prisma.couponAttempt.findUnique({
        where: { couponCode: couponCode.trim().toUpperCase() }
      });

      if (couponAttempt && !couponAttempt.used) {
        finalPrice = Math.max(0, finalPrice - 3000);
        appliedCoupon = couponCode.trim().toUpperCase();
      }
    }

    // 3. Prepare Order Options
    // Razorpay receipt MUST be under 40 characters
    const receipt = `rcpt_${Date.now()}_${courseId.slice(-8)}`; 
    
    const options = {
      amount: Math.round(finalPrice * 100), // Convert to paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        courseId: courseId,
        userId: userId,
        courseName: course.title,
        couponCode: appliedCoupon || 'none',
      }
    };

    // 4. Create Order
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890';
    
    // Check for mock key to allow testing without real credentials
    if (key_id === 'rzp_test_1234567890') {
      console.log('--- MOCK PAYMENT ORDER GENERATED ---');
      const mockOrder = {
        id: `order_mock_${Date.now()}`,
        entity: 'order',
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: 'INR',
        receipt: options.receipt,
        status: 'created',
        attempts: 0,
        notes: options.notes,
        created_at: Math.floor(Date.now() / 1000)
      };
      return res.json(mockOrder);
    }

    const order = await razorpay.orders.create(options);
    res.json(order);

  } catch (error) {
    console.error('\u274c RAZORPAY_ORDER_FAILURE:', {
      message: error.message,
      code: error.code,
      description: error.description,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Error creating Razorpay order',
      details: error.description || error.message 
    });
  }
});

// Verify Razorpay Payment Signature
router.post('/verify', async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature, 
    userId, 
    courseId,
    couponCode
  } = req.body;

  try {
    // 1. Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret';
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    const isValid = generated_signature === razorpay_signature;

    if (!isValid && !razorpay_order_id.startsWith('order_mock_')) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // 2. Grant Access (Enroll User)
    const enrollment = await prisma.courseEnrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      update: {},
      create: {
        userId,
        courseId
      }
    });

    // 3. Mark coupon as used if one was applied
    if (couponCode) {
      try {
        await prisma.couponAttempt.update({
          where: { couponCode: couponCode.trim().toUpperCase() },
          data: { used: true }
        });
      } catch (couponErr) {
        console.error('Coupon marking error (non-critical):', couponErr);
      }
    }

    // 4. Send Confirmation Email (Fire and Forget)
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      
      if (user && course) {
        sendPurchaseConfirmation({
          email: user.contact,
          name: user.name || 'Student',
          courseTitle: course.title,
          amount: course.price,
          orderId: razorpay_order_id
        });
      }
    } catch (emailError) {
      console.error('Email Notification Error:', emailError);
    }

    res.json({ 
      success: true, 
      enrollment,
      message: 'Payment verified and access granted'
    });

  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
