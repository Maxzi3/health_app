import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "../[...nextauth]/route";
import { notifyAdminDoctorSignup } from "@/lib/email";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    mongoose.set("debug", true);

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const specialization = formData.get("specialization") as string;
    const licenseNumber = formData.get("licenseNumber") as string;
    const experience = Number(formData.get("experience") || 0);
    const bio = (formData.get("bio") as string) || "";
    const cvFile = formData.get("cv") as File | null;

    console.log("Form data:", {
      specialization,
      licenseNumber,
      experience,
      bio,
      cvFile: cvFile ? cvFile.name : null,
    });

    if (!specialization || !licenseNumber) {
      return NextResponse.json(
        { message: "Specialization and license number are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.specialization = specialization;
    user.licenseNumber = licenseNumber;
    user.experience = experience;
    user.bio = bio;
    user.needsProfileCompletion = false;

    const updatedUser = await user.save();

    // Uncomment when ready to test email
    const attachments = cvFile
      ? [{ filename: cvFile.name, content: Buffer.from(await cvFile.arrayBuffer()) }]
      : [];
    await notifyAdminDoctorSignup({
      name: updatedUser.name,
      email: updatedUser.email,
      specialization,
      attachments,
    });
    

    return NextResponse.json(
      { message: "Profile completed successfully" },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Complete profile error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
