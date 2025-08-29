import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If no token → redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Handle doctors who need to complete their profile FIRST (highest priority)
    if (
      token.role === "DOCTOR" &&
      (token.needsProfileCompletion ||
        !token.specialization ||
        !token.licenseNumber)
    ) {
      if (pathname !== "/doctor/complete-profile") {
        return NextResponse.redirect(
          new URL("/doctor/complete-profile", req.url)
        );
      }
      return NextResponse.next(); // Allow access to complete-profile page
    }

    // Handle doctors who need approval (but have completed profile)
    if (token.role === "DOCTOR" && !token.isApproved) {
      if (pathname !== "/doctor/pending") {
        return NextResponse.redirect(new URL("/doctor/pending", req.url));
      }
      return NextResponse.next(); // Allow access to pending page
    }

    // All other users proceed normally
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Require login
    },
  }
);

// Protect these routes
export const config = {
  matcher: ["/dashboard/:path*", "/doctor/:path*"],
};
