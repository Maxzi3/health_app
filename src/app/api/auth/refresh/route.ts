import { User } from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/lib/auth";

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refreshsecret";

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();
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
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid refresh token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: user.role,
    });

    return new Response(JSON.stringify({ accessToken: newAccessToken }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid refresh token" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
}
