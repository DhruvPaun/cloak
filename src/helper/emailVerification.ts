import nodemailer from "nodemailer";
import { apiResponse } from "@/types/apiResponse";

// Create a reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dhruvpaun30@gmail.com", // Your Gmail
    pass: process.env.EMAIL_KEY,   // Your App Password
  },
});

export async function sendEmail(
  receiverEmail: string,
  username: string,
  verificationCode: string
): Promise<apiResponse> {
  try {
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #12151B; color: white; border-radius: 10px;">
        <h2 style="color: #5B8CFF;">Welcome to CLOAK</h2>
        <p>Hello <strong>${username}</strong>,</p>
        <p>Your verification code for anonymous messaging is:</p>
        <div style="margin: 20px 0; text-align: center;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #5B8CFF; background: rgba(91, 140, 255, 0.1); padding: 10px 20px; border-radius: 5px; border: 1px solid #5B8CFF;">
            ${verificationCode}
          </span>
        </div>
        <p style="font-size: 12px; color: #64748b;">
          This code will expire in 15 minutes. If you didn't request this, please ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
        <p style="font-size: 10px; color: #475569; text-align: center;">
          © ${new Date().getFullYear()} CLOAK - Anonymous Messaging
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: '"CLOAK Support" <dhruvpaun30@gmail.com>',
      to: receiverEmail, // Now sending to the actual user!
      subject: "Verify your Cloak account",
      html: htmlContent,
    });

    console.log("Email sent successfully to:", receiverEmail);
    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}