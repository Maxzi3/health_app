import { sendEmailVerified } from "@/lib/email";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { z } from "zod";

const verifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = verifyOtpSchema.parse(body);

    await connectDB();

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (user.emailVerified) {
      return new Response(JSON.stringify({ message: "Already verified" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (user.otp !== data.otp) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      return new Response(JSON.stringify({ error: "OTP expired" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    user.emailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Try sending email, but don’t block verification if it fails
    try {
      await sendEmailVerified(user.email, user.name);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    const successMsg =
      user.role === "DOCTOR"
        ? "Email verified. Please wait for admin approval."
        : "Email verified successfully";

    return new Response(JSON.stringify({ message: successMsg }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
