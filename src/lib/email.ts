import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

import {
  otpEmailTemplate,
  passwordResetTemplate,
  adminNotifyDoctorTemplate,
  emailVerifiedTemplate,
} from "./templates";

// Create transporter depending on environment
const transporter = nodemailer.createTransport(
  process.env.NODE_ENV === "production"
    ? {
        // Gmail SMTP for production
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }
    : {
        // Mailtrap for development
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT || 587),
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      }
);

// General email sender
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  attachments?: Attachment[]
) {
  return transporter.sendMail({
    from: `"Medify" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
    attachments,
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
  attachments?: Attachment[];
}) {
  return sendEmail(
    process.env.ADMIN_EMAIL!,
    "Medify: New Doctor Signup",
    adminNotifyDoctorTemplate(details),
    details.attachments
  );
}

// Email Verified
export async function sendEmailVerified(to: string, name?: string) {
  return sendEmail(to, "Medify: Email Verified", emailVerifiedTemplate(name));
}
