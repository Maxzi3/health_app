import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface DecodedToken extends JwtPayload {
  id: string;
  role: "PATIENT" | "DOCTOR";
  isApproved: boolean;
  needsProfileCompletion?: boolean;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "accesssecret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refreshsecret";

export function generateAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" }); // short life
}

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // long life
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}

export function verifyAccessToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as DecodedToken;
  } catch (err) {
    console.error("Invalid access token:", err);
    return null;
  }
}