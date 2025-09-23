import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment.model";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; // 🔹 FIX 1: Await params

    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔹 FIX 2: Handle empty JSON body
    const { status, appointmentNotes } =
      (await req.json().catch(() => ({}))) || {};

    // 🔹 Get user and role
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔹 Allowed statuses by role
    const doctorStatuses = ["COMPLETED", "CONFIRMED", "CANCELLED"];
    const patientStatuses = ["CANCELLED"];

    if (
      (user.role === "DOCTOR" && status && !doctorStatuses.includes(status)) ||
      (user.role === "PATIENT" && status && !patientStatuses.includes(status))
    ) {
      return NextResponse.json(
        { error: "You are not allowed to set this status" },
        { status: 403 }
      );
    }

    // 🔹 Update appointment
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(appointmentNotes && { appointmentNotes }),
      },
      { new: true }
    );

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
