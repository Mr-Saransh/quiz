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
      from: `"Apni Vidya" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Purchase Confirmed: ${courseTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #00A693 0%, #00796B 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Welcome to ${courseTitle}!</h1>
            <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Your journey to mastery starts here.</p>
          </div>
          
          <div style="padding: 40px 30px; background-color: white;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 25px;">
              Thank you for choosing <strong>Apni Vidya</strong>. We are thrilled to have you in the <strong>${courseTitle}</strong> course. Your payment was successful, and your enrollment is now active.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 25px;">
              <h3 style="margin: 0 0 15px; color: #333; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Order Details</h3>
              <table style="width: 100%; font-size: 15px; color: #444;">
                <tr>
                  <td style="padding: 5px 0; color: #777;">Order ID:</td>
                  <td style="padding: 5px 0; font-weight: 600; text-align: right;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #777;">Amount Paid:</td>
                  <td style="padding: 5px 0; font-weight: 600; text-align: right; color: #00A693;">₹${amount}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #777;">Date:</td>
                  <td style="padding: 5px 0; font-weight: 600; text-align: right;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/profile" style="background-color: #00A693; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,166,147,0.3);">Go to My Courses</a>
            </div>
          </div>
          
          <div style="background-color: #f1f3f4; padding: 20px; text-align: center; font-size: 13px; color: #777; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px;">Need help? Reply to this email or contact support.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Apni Vidya. All rights reserved.</p>
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
