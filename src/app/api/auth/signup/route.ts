import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendOtpEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateOTP } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with OTP
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      emailVerified: false,
      isApproved: role === "PATIENT", // Patients auto-approved
      needsProfileCompletion: role === "DOCTOR", // Doctors need profile completion
      otp,
      otpExpiry,
    });

    await user.save();

    // Send OTP email
    sendOtpEmail(email, name, otp);

    return NextResponse.json(
      { message: "User created successfully. Please verify your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
