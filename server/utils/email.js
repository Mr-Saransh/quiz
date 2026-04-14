import nodemailer from 'nodemailer';

/**
 * Sends a purchase confirmation email to the user.
 * 
 * @param {Object} details - The purchase details
 * @param {string} details.email - The recipient's email address
 * @param {string} details.name - The recipient's name
 * @param {string} details.courseTitle - The title of the course purchased
 * @param {number} details.amount - The amount paid
 * @param {string} details.orderId - The Razorpay order ID
 */
export async function sendPurchaseConfirmation({ email, name, courseTitle, amount, orderId }) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Find Your Spark" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✨ Welcome to your course: ${courseTitle}`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">Find Your Spark</h1>
            <p style="margin: 15px 0 0; font-size: 18px; opacity: 0.9;">Enrollment Confirmed!</p>
          </div>
          
          <div style="padding: 40px; background-color: white;">
            <p style="font-size: 18px; color: #1e293b; margin-bottom: 24px;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 30px;">
              Welcome to the family! You've successfully enrolled in <strong>${courseTitle}</strong>. Your professional journey starts now, and we're excited to have you with us.
            </p>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
              <h3 style="margin: 0 0 15px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">Order Summary</h3>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #64748b; font-size: 14px;">Course:</span>
                <span style="color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${courseTitle}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #64748b; font-size: 14px;">Amount:</span>
                <span style="color: #4f46e5; font-size: 14px; font-weight: 700; text-align: right;">₹${amount}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b; font-size: 14px;">Order ID:</span>
                <span style="color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${orderId}</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="http://localhost:5173/profile" style="background-color: #4f46e5; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4);">Access Your Course</a>
            </div>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0 0 10px;">If you have any questions, simply reply to this email.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Find Your Spark. Built for the dreamers.</p>
          </div>
        </div>
      `,
    };


    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    return { success: false, error: error.message };
  }
}
