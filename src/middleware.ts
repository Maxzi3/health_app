// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If no token and trying to access protected routes
    if (
      !token &&
      (pathname.startsWith("/dashboard") || pathname.startsWith("/bot"))
    ) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // If user is authenticated
    if (token) {
      const { role, isApproved, needsProfileCompletion } = token;

      // Dashboard route - only for approved doctors
      if (pathname.startsWith("/dashboard")) {
        if (role !== "DOCTOR") {
          return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
        }
        if (needsProfileCompletion) {
          return NextResponse.redirect(
            new URL("/auth/complete-profile", req.url)
          );
        }
        if (!isApproved) {
          return NextResponse.redirect(new URL("/pending", req.url));
        }
      }

      // Bot route - only for patients
      if (pathname.startsWith("/bot")) {
        if (role !== "PATIENT") {
          return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
        }
      }

      // Complete profile route - only for doctors with incomplete profiles
      if (pathname === "/auth/complete-profile") {
        if (role !== "DOCTOR" || !needsProfileCompletion) {
          // Redirect based on role and status
          if (role === "PATIENT") {
            return NextResponse.redirect(new URL("/bot", req.url));
          }
          if (role === "DOCTOR" && isApproved) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
          }
          if (role === "DOCTOR" && !isApproved) {
            return NextResponse.redirect(new URL("/pending", req.url));
          }
        }
      }

      // Pending route - only for doctors who need approval
      if (pathname === "/pending") {
        if (role !== "DOCTOR") {
          return NextResponse.redirect(new URL("/bot", req.url));
        }
        if (needsProfileCompletion) {
          return NextResponse.redirect(
            new URL("/auth/complete-profile", req.url)
          );
        }
        if (isApproved) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }

      // Prevent authenticated users from accessing auth pages
      if (
        pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/signup")
      ) {
        if (role === "PATIENT") {
          return NextResponse.redirect(new URL("/bot", req.url));
        }
        if (role === "DOCTOR") {
          if (needsProfileCompletion) {
            return NextResponse.redirect(
              new URL("/auth/complete-profile", req.url)
            );
          }
          if (!isApproved) {
            return NextResponse.redirect(new URL("/pending", req.url));
          }
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to public routes
        if (
          pathname.startsWith("/auth/") ||
          pathname === "/" ||
          pathname.startsWith("/api/auth/") ||
          pathname.startsWith("/_next/") ||
          pathname === "/favicon.ico"
        ) {
          return true;
        }

        // For protected routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
