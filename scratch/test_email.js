import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('Node version:', process.version);
const EMAIL_USER = (process.env.EMAIL_USER || '').trim();
const EMAIL_PASSWORD = (process.env.EMAIL_PASSWORD || '').trim();



console.log('Using EMAIL_USER:', EMAIL_USER);

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });



  try {
    const info = await transporter.sendMail({
      from: `"Test" <${EMAIL_USER}>`,
      to: EMAIL_USER, // send to self
      subject: 'Test Email',
      text: 'Hello from test script',
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmail();
