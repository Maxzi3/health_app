import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const refreshToken = req.headers
      .get("cookie")
      ?.match(/refreshToken=([^;]+)/)?.[1];
    if (!refreshToken) {
      return new Response(JSON.stringify({ message: "No refresh token" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie":
            "refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
        },
      });
    }

    await connectDB();
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    return new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie":
            "refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
        },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
