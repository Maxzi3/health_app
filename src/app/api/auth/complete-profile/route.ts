import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, role, specialization, licenseNumber } = await req.json();

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Only doctors can update profile" },
        { status: 403 }
      );
    }

    user.role = "DOCTOR";
    user.specialization = specialization;
    user.licenseNumber = licenseNumber;
    user.isApproved = false; // wait for admin

    await user.save();

    return NextResponse.json({
      message: "Profile updated, awaiting admin approval",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
