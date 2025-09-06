// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          isApproved: user.isApproved,
          needsProfileCompletion: user.needsProfileCompletion,
        };
      },
    }),
  ],

  // ADD THIS COOKIES CONFIGURATION
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15, // 15 minutes
      },
    },
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15, // 15 minutes
      },
    },
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();

        try {
          // Check if user already exists
          const existingUser = await User.findOne({
            $or: [{ email: user.email?.toLowerCase() }, { googleId: user.id }],
          });

          if (existingUser) {
            // User exists, update their Google ID if not set
            if (!existingUser.googleId) {
              await User.findByIdAndUpdate(existingUser._id, {
                googleId: user.id,
              });
            }

            // Update user object with database info
            user.id = existingUser._id.toString();
            user.role = existingUser.role;
            user.isApproved = existingUser.isApproved;
            user.needsProfileCompletion = existingUser.needsProfileCompletion;
            return true;
          }

          // New user - get intended role from cookie
          const cookieStore = await cookies();
          const intendedRole =
            (cookieStore.get("intended-role")?.value as "PATIENT" | "DOCTOR") ||
            "PATIENT";

          // Create new user with your schema structure
          const newUser = new User({
            name: user.name || "",
            email: user.email?.toLowerCase() || "",
            password: "", // Empty for Google OAuth users
            role: intendedRole,
            emailVerified: true, // Google OAuth users are pre-verified
            googleId: user.id,
            isApproved: intendedRole === "PATIENT", // Patients auto-approved
            needsProfileCompletion: intendedRole === "DOCTOR", // Doctors need profile completion
            refreshToken: null,
          });

          const savedUser = await newUser.save();

          // Update user object with database info
          user.id = savedUser._id.toString();
          user.role = savedUser.role;
          user.isApproved = savedUser.isApproved;
          user.needsProfileCompletion = savedUser.needsProfileCompletion;

          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.isApproved = user.isApproved;
        token.needsProfileCompletion = user.needsProfileCompletion;
      }

      // Refresh user data from database on each token refresh
      if (token.sub) {
        try {
          await connectDB();
          const dbUser = await User.findById(token.sub);
          if (dbUser) {
            token.role = dbUser.role;
            token.isApproved = dbUser.isApproved;
            token.needsProfileCompletion = dbUser.needsProfileCompletion;
          }
        } catch (error) {
          console.error("Error refreshing user data in JWT:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as "PATIENT" | "DOCTOR";
        session.user.isApproved = token.isApproved as boolean;
        session.user.needsProfileCompletion =
          token.needsProfileCompletion as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects after sign in
      const urlObj = new URL(url.startsWith("/") ? `${baseUrl}${url}` : url);

      // If coming from a callback, determine where to redirect
      if (
        urlObj.pathname === "/api/auth/callback/google" ||
        urlObj.pathname === "/api/auth/callback/credentials"
      ) {
        return `${baseUrl}/auth/redirect-handler`;
      }

      // Default redirect handling
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role: "PATIENT" | "DOCTOR";
    isApproved: boolean;
    needsProfileCompletion: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "PATIENT" | "DOCTOR";
      isApproved: boolean;
      needsProfileCompletion: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "PATIENT" | "DOCTOR";
    isApproved: boolean;
    needsProfileCompletion: boolean;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
