import nodemailer from 'nodemailer';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_USER = process.env.EMAIL_USER;

console.log('Using RESEND_API_KEY:', RESEND_API_KEY);

async function testResend() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
      user: 'resend',
      pass: RESEND_API_KEY,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: 'onboarding@resend.dev',
      to: 'apnividya.in@gmail.com',
      subject: 'Test Resend OTP',
      text: 'Hello from Resend',
    });
    console.log('Resend email sent:', info.messageId);
  } catch (error) {
    console.error('Resend test failed:', error);
  }
}

testResend();
