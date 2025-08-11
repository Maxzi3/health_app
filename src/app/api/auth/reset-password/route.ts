import { NextApiRequest, NextApiResponse } from "next";
import {User }from "@/models/User";
import { hashToken } from "@/lib/token";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  await connectDB();

  const { token, id, password } = req.body;
  if (!token || !id || !password) return res.status(400).json({ error: "Invalid request" });

  const hashedToken = hashToken(token);
  const user = await User.findOne({
    _id: id,
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
}
