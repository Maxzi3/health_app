import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment.model";
import Prescription from "@/models/Prescription.model";
import { Types } from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const patient = await User.findOne({
      email: session.user.email,
      role: "PATIENT",
    }).lean();

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const patientId = new Types.ObjectId(patient._id);

    // Query counts from DB
    const upcomingAppointments = await Appointment.countDocuments({
      patientId,
      date: { $gte: new Date() },
    });

    const activePrescriptions = await Prescription.countDocuments({
      patientId,
      status: "ACTIVE",
    });

    const totalPrescriptions = await Prescription.countDocuments({
      patientId,
    });

    const stats = {
      upcomingAppointments,
      activePrescriptions,
      totalPrescriptions,
    };

    return NextResponse.json({ profile: patient, stats });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
