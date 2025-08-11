import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { z } from "zod";
import { comparePassword, generateAuthToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    await connectDB();

    const user = await User.findOne({ email });
    if (!user)
      return Response.json({ error: "Invalid credentials" }, { status: 401 });

    if (!user.emailVerified)
      return Response.json(
        { error: "Please verify your email first" },
        { status: 403 }
      );

    if (user.role === "DOCTOR" && !user.isApproved) {
      return Response.json(
        { error: "Your account is under review by admin" },
        { status: 403 }
      );
    }

    const isValid = await comparePassword(password, user.password || "");
    if (!isValid)
      return Response.json({ error: "Invalid credentials" }, { status: 401 });

    const token = generateAuthToken({ id: user._id, role: user.role });

    // include role and redirect hint
    const redirectTo =
      user.role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient";

    return Response.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectTo,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
