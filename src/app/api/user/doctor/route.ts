import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment.model";
import Prescription from "@/models/Prescription.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find doctor
    const doctor = await User.findOne({
      email: session.user.email,
      role: "DOCTOR",
    }).lean();

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // === Compute doctor stats ===
    const doctorId = doctor._id;

    const upcomingAppointments = await Appointment.countDocuments({
      doctorId,
      date: { $gte: new Date() },
      status: "SCHEDULED",
    });

    const pendingPrescriptions = await Prescription.countDocuments({
      doctorId,
      status: "PENDING",
    });

    const completedConsultations = await Appointment.countDocuments({
      doctorId,
      status: "COMPLETED",
    });

    const totalPatients = await Appointment.distinct("patientId", {
      doctorId,
    }).then((patients) => patients.length);

    // === Return wrapped response ===
    return NextResponse.json({
      profile: doctor,
      stats: {
        upcomingAppointments,
        pendingPrescriptions,
        completedConsultations,
        totalPatients,
      },
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
