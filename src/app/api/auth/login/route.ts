import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { z } from "zod";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";
import { sendOtpEmail } from "@/lib/email";

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
    if (!user || !user.password) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 🔒 Handle unverified email
    if (!user.emailVerified) {
      const now = Date.now();
      const otpExpired = !user.otpExpiry || user.otpExpiry.getTime() < now;

      if (otpExpired) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = new Date(now + 15 * 60 * 1000); // 15 min expiry
        await user.save();

        // send OTP email
        await sendOtpEmail(user.email, user.name, otp);
      }

      return new Response(
        JSON.stringify({
          error: "Email not verified. A verification code has been sent.",
          requiresVerification: true,
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    //  Doctors must be approved
    if (user.role === "DOCTOR" && !user.isApproved) {
      return new Response(
        JSON.stringify({ error: "Your account is under review" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 🔑 Validate password
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

    // ✅ Generate Tokens
    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    const redirectTo = process.env.CHATBOT_URL;
    const isProd = process.env.NODE_ENV === "production";

    let cookie = `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Strict; Max-Age=604800`;
    if (isProd) cookie += "; Secure";

    return new Response(
      JSON.stringify({
        accessToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        redirectTo,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
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
