import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/User";
import { generateResetToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/email";
import { connectDB } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  await connectDB();

  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(200)
      .json({ message: "If an account exists, a reset link has been sent." });
  }

  const { token, hashedToken } = generateResetToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&id=${user._id}`;
  await sendPasswordResetEmail(user.email, user.name, resetUrl);

  res
    .status(200)
    .json({ message: "If an account exists, a reset link has been sent." });
}
