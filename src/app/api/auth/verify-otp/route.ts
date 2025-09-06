import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import  User  from "@/models/User";


export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with matching email and OTP
    const user = await User.findOne({
      email: email.toLowerCase(),
      otp: otp,
      otpExpiry: { $gt: new Date() }, // OTP not expired
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Update user as verified and clear OTP
    await User.findByIdAndUpdate(user._id, {
      emailVerified: true,
      otp: null,
      otpExpiry: null,
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}