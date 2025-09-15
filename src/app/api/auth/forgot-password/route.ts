import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { generateResetToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const user = await User.findOne({ email });

    // Always respond success to prevent enumeration
    if (!user) {
      return new Response(
        JSON.stringify({
          message: "If an account exists, a reset link has been sent.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate reset token (valid for 15 minutes)
    const { token, hashedToken } = generateResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

   const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}&id=${user._id}`;
   console.log("RESET URL SENT IN EMAIL:", resetUrl);

   await sendPasswordResetEmail(user.email, user.name, resetUrl);

    return new Response(
      JSON.stringify({
        message: "If an account exists, a reset link has been sent.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Password reset request error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
