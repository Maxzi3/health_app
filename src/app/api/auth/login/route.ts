import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { z } from "zod";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!user.emailVerified) {
      return new Response(
        JSON.stringify({ error: "Please verify your email first" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (user.role === "DOCTOR" && !user.isApproved) {
      return new Response(
        JSON.stringify({ error: "Your account is under review by admin" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!user.password) {
      return new Response(
        JSON.stringify({ error: "No password set for this account" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 🔑 Generate Tokens
    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Store refresh token in DB for logout/revocation support
    user.refreshToken = refreshToken;
    await user.save();

    // // Role-based redirect
    // const redirectTo =
    //   user.role === "DOCTOR"
    //     ? process.env.DOCTOR_DASHBOARD_URL || "/dashboard/doctor"
    //     : process.env.PATIENT_DASHBOARD_URL || "/dashboard/patient";

    // Return access token in body, refresh token in HTTP-only cookie
    return new Response(
      JSON.stringify({
        accessToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        // redirectTo,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`, // 7 days
        },
      }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: "Invalid input data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
