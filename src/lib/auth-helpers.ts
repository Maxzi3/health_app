import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return session;
}

export async function requireRole(
  req: NextRequest,
  requiredRole: "PATIENT" | "DOCTOR"
) {
  const session = await requireAuth(req);

  if (session instanceof NextResponse) return session; // Error response

  if (session.user.role !== requiredRole) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return session;
}
