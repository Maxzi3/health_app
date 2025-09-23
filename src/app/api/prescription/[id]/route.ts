import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/models/Prescription.model";
import User from "@/models/User";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user and prescription to verify permissions
    const user = await User.findOne({ email: session.user.email });
    const prescription = await Prescription.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    //  Check if the user is a doctor OR the patient who owns the prescription
    const isDoctor = user.role === "DOCTOR";
    const isOwner = prescription.patientId.toString() === user._id.toString();

    // Allow the update only if it's a doctor or the patient who owns the prescription
    //    and the status is "COMPLETED"
    let updatedPrescription;
    let body: { status?: string } = {};
    try {
      body = await req.json();
    } catch {
      // Gracefully handle empty body
    }

    // Only update status to "COMPLETED" for patients, or any status for doctors
    if (isDoctor) {
      updatedPrescription = await Prescription.findByIdAndUpdate(
        id,
        { ...body }, // Doctors can change other fields like notes
        { new: true }
      );
    } else if (isOwner && body.status === "COMPLETED") {
      updatedPrescription = await Prescription.findByIdAndUpdate(
        id,
        { status: "COMPLETED" },
        { new: true }
      );
    } else {
      return NextResponse.json(
        { error: "Forbidden: You are not allowed to perform this action" },
        { status: 403 }
      );
    }

    return NextResponse.json(updatedPrescription);
  } catch (err) {
    console.error("Error updating prescription:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
