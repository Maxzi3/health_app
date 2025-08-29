import NextAuth, { NextAuthOptions, Profile, DefaultSession } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

// Type augmentation for NextAuth
declare module "next-auth" {
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
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    isApproved: boolean;
    mustCompleteProfile: boolean;
    needsProfileCompletion: boolean;
    specialization?: string | null;
    licenseNumber?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Simplified signIn callback for debugging
    async signIn({ user, account, profile }) {
      console.log("=== SIMPLE SignIn Callback ===");
      console.log("User email:", user.email);
      console.log("Account provider:", account?.provider);

      // Just return true for now to test basic flow
      return true;
    },

    // Simplified JWT callback
    async jwt({ token, user }) {
      console.log("=== JWT Callback ===");
      console.log("Token:", token);

      // Set default values for now
      if (token.email) {
        token.role = "PATIENT";
        token.isApproved = true;
        token.mustCompleteProfile = false;
        token.needsProfileCompletion = false;
      }

      return token;
    },

    // Simplified session callback
    async session({ session, token }) {
      console.log("=== Session Callback ===");
      console.log("Session:", session);

      if (session.user) {
        session.user.role = token.role as string;
        session.user.isApproved = token.isApproved as boolean;
        session.user.needsProfileCompletion =
          token.needsProfileCompletion as boolean;
        session.user.mustCompleteProfile = token.mustCompleteProfile as boolean;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  debug: true, // Enable debug mode
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
