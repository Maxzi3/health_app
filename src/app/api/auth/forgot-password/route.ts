import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { z } from "zod";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

const reqSchema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const { email } = reqSchema.parse(await req.json());
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      // do not leak existence
      return Response.json({
        message: "If that email exists we sent a reset link",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetLink = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendPasswordResetEmail(user.email, user.name, resetLink);

    return Response.json({
      message: "If that email exists we sent a reset link",
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
