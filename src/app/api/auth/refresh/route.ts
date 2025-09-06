import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { generateAccessToken } from "@/lib/auth";
import jwt from "jsonwebtoken";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export async function POST(req: Request) {
  try {
    // ✅ Extract refreshToken from cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const refreshToken = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("refreshToken="))
      ?.split("=")[1];

    if (!refreshToken) {
      return new Response(
        JSON.stringify({ error: "No refresh token provided" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await connectDB();

    // ✅ Find user by refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid refresh token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Verify token signature
    try {
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid refresh token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Issue new access token with full payload
    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
      isApproved: user.isApproved,
      needsProfileCompletion: user.needsProfileCompletion,
    });

    return new Response(JSON.stringify({ accessToken }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Refresh error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
