import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  // Extend Session
  interface Session {
    user: {
      id: string;
      role: string;
      isApproved: boolean;
      mustCompleteProfile: boolean;
      needsProfileCompletion: boolean;
      specialization?: string | null;
      licenseNumber?: string | null;
    } & DefaultSession["user"];
  }

  // Extend JWT
  interface User extends DefaultUser {
    role: string;
    isApproved: boolean;
    specialization?: string | null;
    licenseNumber?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    isApproved: boolean;
    specialization?: string | null;
    licenseNumber?: string | null;
  }
}
