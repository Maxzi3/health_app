import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { sendOtpEmail, notifyAdminDoctorSignup } from "@/lib/email";

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["PATIENT", "DOCTOR"]),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  documents: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = signupSchema.parse(body);

    await connectDB();

    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashed = await hashPassword(data.password);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role,
      specialization: data.role === "DOCTOR" ? data.specialization : undefined,
      licenseNumber: data.role === "DOCTOR" ? data.licenseNumber : undefined,
      documents: data.role === "DOCTOR" ? data.documents || [] : [],
      otp,
      otpExpiry,
      emailVerified: false,
      isApproved: data.role === "DOCTOR" ? false : true,
    });

    // send otp email
    await sendOtpEmail(user.email, user.name, otp);

    // notify admin if doctor
    if (data.role === "DOCTOR") {
      await notifyAdminDoctorSignup({
        name: data.name,
        email: data.email,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
      });
    }

    return Response.json({
      message: "Signup successful, verify your email with the OTP",
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
