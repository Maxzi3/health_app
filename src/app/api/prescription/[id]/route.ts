/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/models/Prescription.model";
import User from "@/models/User";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(req: Request, context: any) {
  try {
    const { id } = (context as { params: { id: string } }).params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user and prescription
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

    const isDoctor = user.role === "DOCTOR";
    const isOwner = prescription.patientId.toString() === user._id.toString();

    let body: { status?: string; prescriptionNotes?: string } = {};
    try {
      body = await req.json();
    } catch {
      // handle empty body gracefully
    }

    let updatedPrescription;

    if (isDoctor) {
      // Doctor can set any status + update notes
      updatedPrescription = await Prescription.findByIdAndUpdate(
        id,
        {
          ...(body.status && { status: body.status }),
          ...(body.prescriptionNotes && {
            prescriptionNotes: body.prescriptionNotes,
          }),
        },
        { new: true }
      );
    } else if (isOwner && body.status === "COMPLETED") {
      // Patient can only mark as completed
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
