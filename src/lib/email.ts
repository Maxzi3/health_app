import nodemailer from "nodemailer";
import {
  otpEmailTemplate,
  passwordResetTemplate,
  adminNotifyDoctorTemplate,
  emailVerifiedTemplate,
} from "./templates";

// Create a single reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// General email sender
async function sendEmail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: `"Medify" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

// OTP Email
export async function sendOtpEmail(to: string, name: string, otp: string) {
  return sendEmail(
    to,
    "Medify: Verify your email",
    otpEmailTemplate(name, otp)
  );
}

// Password Reset Email
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetLink: string
) {
  return sendEmail(
    to,
    "Medify: Reset your password",
    passwordResetTemplate(name, resetLink)
  );
}

// Notify Admin of Doctor Signup
export async function notifyAdminDoctorSignup(details: {
  name: string;
  email: string;
  specialization?: string;
  licenseNumber?: string;
}) {
  return sendEmail(
    process.env.ADMIN_EMAIL!,
    "Medify: New Doctor Signup",
    adminNotifyDoctorTemplate(details)
  );
}

export async function sendEmailVerified(to: string, name?: string) {
  return sendEmail(to, "Medify: Email Verified", emailVerifiedTemplate(name));
}
