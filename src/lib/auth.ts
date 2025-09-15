import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface DecodedToken extends JwtPayload {
  id: string;
  role: "PATIENT" | "DOCTOR";
  isApproved: boolean;
  needsProfileCompletion?: boolean;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}
