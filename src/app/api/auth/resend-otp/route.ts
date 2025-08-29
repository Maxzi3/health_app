import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (user.emailVerified) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email already verified",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    try {
      await sendOtpEmail(user.email, user.name, otp);
    } catch (emailErr: any) {
      console.error("Failed to send OTP email:", emailErr.message);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Could not send OTP email",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "New OTP sent to your email",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Resend OTP error:", err.message);
    return new Response(
      JSON.stringify({ success: false, message: "Something went wrong" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
