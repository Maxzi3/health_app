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
    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    if (user.emailVerified)
      return Response.json({ message: "Already verified" });

    if (user.otp !== data.otp)
      return Response.json({ error: "Invalid OTP" }, { status: 400 });

    if (user.otpExpiry && user.otpExpiry < new Date())
      return Response.json({ error: "OTP expired" }, { status: 400 });

    user.emailVerified = true;
    user.otp = "";
    user.otpExpiry = new Date(0);
    await user.save();

    // Send confirmation email
 await sendEmailVerified(user.email, user.name);


    if (user.role === "DOCTOR") {
      return Response.json({
        message: "Email verified. Please wait for admin approval.",
      });
    }
    return Response.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
