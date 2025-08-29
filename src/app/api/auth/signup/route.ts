import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { sendOtpEmail, notifyAdminDoctorSignup } from "@/lib/email";
import type { Attachment } from "nodemailer/lib/mailer";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const role = form.get("role") as "PATIENT" | "DOCTOR";
    const specialization = form.get("specialization") as string | null;
    const cvFile = form.get("cv") as File | null; // doctor CV upload

    if (!name || !email || !password || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    //  check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hashed = await hashPassword(password);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    //  save user in DB
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      specialization: role === "DOCTOR" ? specialization : undefined,
      otp,
      otpExpiry,
      emailVerified: false,
      isApproved: role === "DOCTOR" ? false : true,
    });

    //  send otp email (don’t break if it fails)
    try {
      await sendOtpEmail(user.email, user.name, otp);
    } catch (emailErr: unknown) {
      if (emailErr instanceof Error) {
        console.error("OTP email sending failed:", emailErr.message);
      } else {
        console.error("OTP email sending failed:", emailErr);
      }
    }

    //  notify admin if doctor signup
    if (role === "DOCTOR") {
      try {
        const attachments: Attachment[] = [];

        if (cvFile) {
          const buffer = Buffer.from(await cvFile.arrayBuffer());
          attachments.push({
            filename: cvFile.name,
            content: buffer,
          });
        }

        await notifyAdminDoctorSignup({
          name,
          email,
          specialization: specialization || "",
          attachments,
        });
      } catch (adminErr: unknown) {
        if (adminErr instanceof Error) {
          console.error("Admin notification failed:", adminErr.message);
        } else {
          console.error("Admin notification failed:", adminErr);
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: "Signup successful, verify your email with the OTP",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Signup route error:", err.message);
    } else {
      console.error("Signup route error:", err);
    }

    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
