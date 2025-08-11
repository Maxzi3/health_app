import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/User";
import { hashToken } from "@/lib/token";
import { connectDB } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method Not Allowed" });

  await connectDB();

  const { token, id } = req.query;
  if (!token || !id) return res.status(400).json({ error: "Invalid request" });

  const hashedToken = hashToken(token as string);
  const user = await User.findOne({
    _id: id,
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  res.status(200).json({ message: "Token valid" });
}
