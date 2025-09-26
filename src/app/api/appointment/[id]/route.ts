/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment.model";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function PATCH(req: NextRequest, context: any) {
  try {
    const { id } = (context as { params: { id: string } }).params;

    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, appointmentNotes, date, time } = await req
      .json()
      .catch(() => ({}));

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Validate appointment datetime (if provided)
    if (date) {
      const appointmentDateTime = new Date(date);

      if (time) {
        const [hours, minutes] = time.split(":").map(Number);
        appointmentDateTime.setHours(hours, minutes, 0, 0);
      }

      if (appointmentDateTime < new Date()) {
        return NextResponse.json(
          { error: "Appointment cannot be in the past" },
          { status: 400 }
        );
      }
    }

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
