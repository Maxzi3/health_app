const brandHeader = `
  <div style="background:#2563eb;padding:16px;text-align:center;">
    <img src="https://your-medify-logo-url.com/logo.png" alt="Medify" style="height:40px;">
  </div>
`;

const brandFooter = `
  <div style="margin-top:30px;font-size:12px;color:#6b7280;text-align:center;">
    <p>© ${new Date().getFullYear()} Medify Healthcare. All rights reserved.</p>
    <p>123 Health Street, Wellness City, Country</p>
  </div>
`;

export function otpEmailTemplate(name: string, otp: string) {
  return `
    ${brandHeader}
    <div style="font-family: Inter, Arial, sans-serif; max-width:600px; margin:0 auto; padding:24px;">
      <h2 style="color:#0f172a;">Hello ${name || "there"},</h2>
      <p>Please use the code below to verify your Medify account. It expires in <strong>15 minutes</strong>.</p>
      <div style="display:inline-block;padding:12px 20px;background:#f3f4f6;border-radius:6px;font-size:24px;letter-spacing:4px;">
        ${otp}
      </div>
      <p style="margin-top:20px;color:#6b7280;">If you did not request this, you can ignore this email.</p>
    </div>
    ${brandFooter}
  `;
}

export function passwordResetTemplate(name: string, resetLink: string) {
  return `
    ${brandHeader}
    <div style="font-family: Inter, Arial, sans-serif; max-width:600px; margin:0 auto; padding:24px;">
      <h2 style="color:#0f172a;">Hi ${name || "there"},</h2>
      <p>We received a request to reset your Medify password. Click the button below to reset it. This link will expire in 1 hour.</p>
      <a href="${resetLink}" style="display:inline-block;margin-top:12px;padding:12px 18px;border-radius:6px;background:#2563eb;color:#fff;text-decoration:none;">
        Reset Password
      </a>
      <p style="margin-top:18px;color:#6b7280;">If you didn’t request this, please ignore this email or contact our support team.</p>
    </div>
    ${brandFooter}
  `;
}

export function adminNotifyDoctorTemplate(details: {
  name: string;
  email: string;
  specialization?: string;
  licenseNumber?: string;
}) {
  return `
    ${brandHeader}
    <div style="font-family: Inter, Arial, sans-serif; max-width:600px; margin:0 auto; padding:24px;">
      <h2 style="color:#0f172a;">New Doctor Registration</h2>
      <p><strong>Name:</strong> ${details.name}</p>
      <p><strong>Email:</strong> ${details.email}</p>
      <p><strong>Specialization:</strong> ${details.specialization || "N/A"}</p>
      <p><strong>License:</strong> ${details.licenseNumber || "N/A"}</p>
      <p>Please review and approve in the admin panel.</p>
    </div>
    ${brandFooter}
  `;
}
export function emailVerifiedTemplate(name?: string) {
  return `
    ${brandHeader}
    <div style="font-family: Inter, Arial, sans-serif; max-width:600px; margin:0 auto; padding:24px;">
      <h2 style="color:#0f172a;">Hello ${name || "there"},</h2>
      <p>Your email has been successfully verified ✅</p>
      <p>You can now log in to your Medify account and enjoy full access to our services.</p>
    </div>
    ${brandFooter}
  `;
}

