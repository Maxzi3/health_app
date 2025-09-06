import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "PATIENT" | "DOCTOR";
      isApproved: boolean;
      needsProfileCompletion: boolean;
      specialization?: string | null;
    };
  }

  interface User {
    id: string;
    role: "PATIENT" | "DOCTOR";
    isApproved: boolean;
    needsProfileCompletion: boolean;
    specialization?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "PATIENT" | "DOCTOR";
    isApproved: boolean;
    needsProfileCompletion: boolean;
    specialization?: string | null;
  }
}
