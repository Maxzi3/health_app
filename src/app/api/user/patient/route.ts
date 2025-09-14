import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

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

    // Example: fetch stats (appointments, prescriptions, consultations)
    const stats = {
      upcomingAppointments: 3, // Replace with Appointment.countDocuments({ patientId: patient._id, date > today })
      activePrescriptions: 2, // Replace with Prescription.countDocuments({ patientId: patient._id, active: true })
      totalConsultations: 12, // Replace with Consultation.countDocuments({ patientId: patient._id })
    };

    return NextResponse.json({ profile: patient, stats });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
