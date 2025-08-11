import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";

export function generateAuthToken(payload: {
  id: Types.ObjectId;
  role: string;
}) {
  return jwt.sign(
    { id: payload.id.toString(), role: payload.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}
