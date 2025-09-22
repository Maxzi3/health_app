import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/models/Prescription.model";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const prescription = await Prescription.findByIdAndUpdate(
      params.id,
      {
        prescriptionNotes: body.prescriptionNotes,
        status: "ACTIVE",
      },
      { new: true }
    );

    return NextResponse.json(prescription);
  } catch (err) {
    console.error("Error updating prescription:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
