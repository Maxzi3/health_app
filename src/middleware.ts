import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Create response first to add security headers
    const response = NextResponse.next();

    // Add security headers to all responses
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // Only add HSTS in production with HTTPS
    if (process.env.NODE_ENV === "production") {
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
      );
    }

    // CSP header (adjust based on your needs)
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    );

    // Handle CORS for API routes
    if (pathname.startsWith("/api/")) {
      const origin = req.headers.get("origin");
      const allowedOrigins = [
        process.env.NEXTAUTH_URL,
        process.env.NEXT_PUBLIC_APP_URL,
        "http://localhost:3000",
        "https://localhost:3000",
      ].filter(Boolean);

      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
      }

      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With"
      );

      // Handle preflight requests
      if (req.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: response.headers });
      }
    }

    // Your existing authentication logic
    // Unauthenticated trying to access any dashboard → redirect to login
    if (!token && pathname.startsWith("/dashboard")) {
      const redirectResponse = NextResponse.redirect(
        new URL("/auth/login", req.url)
      );
      // Copy security headers to redirect response
      response.headers.forEach((value, key) => {
        redirectResponse.headers.set(key, value);
      });
      return redirectResponse;
    }

    if (token) {
      const { role, isApproved, needsProfileCompletion } = token;

      // 👩‍⚕️ Doctor dashboard
      if (pathname.startsWith("/dashboard/doctor")) {
        if (role !== "DOCTOR") {
          const redirectResponse = NextResponse.redirect(
            new URL("/auth/unauthorized", req.url)
          );
          response.headers.forEach((value, key) => {
            redirectResponse.headers.set(key, value);
          });
          return redirectResponse;
        }
        if (needsProfileCompletion) {
          const redirectResponse = NextResponse.redirect(
            new URL("/auth/complete-profile", req.url)
          );
          response.headers.forEach((value, key) => {
            redirectResponse.headers.set(key, value);
          });
          return redirectResponse;
        }
        if (!isApproved) {
          const redirectResponse = NextResponse.redirect(
            new URL("/pending", req.url)
          );
          response.headers.forEach((value, key) => {
            redirectResponse.headers.set(key, value);
          });
          return redirectResponse;
        }
      }

      // 🧑‍🦰 Patient dashboard
      if (pathname.startsWith("/dashboard/patient")) {
        if (role !== "PATIENT") {
          const redirectResponse = NextResponse.redirect(
            new URL("/auth/unauthorized", req.url)
          );
          response.headers.forEach((value, key) => {
            redirectResponse.headers.set(key, value);
          });
          return redirectResponse;
        }
      }

      // 🤖 Bot route → open to unauthenticated + patients
      if (pathname.startsWith("/bot")) {
        if (role === "DOCTOR") {
          const redirectResponse = NextResponse.redirect(
            new URL("/auth/unauthorized", req.url)
          );
          response.headers.forEach((value, key) => {
            redirectResponse.headers.set(key, value);
          });
          return redirectResponse;
        }
      }

      // 🚫 Prevent authenticated users from accessing login/signup
      if (
        pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/signup")
      ) {
        if (role === "PATIENT") {
          const redirectResponse = NextResponse.redirect(
            new URL("/bot", req.url)
          );
          response.headers.forEach((value, key) => {
            redirectResponse.headers.set(key, value);
          });
          return redirectResponse;
        }
        if (role === "DOCTOR") {
          if (needsProfileCompletion) {
            const redirectResponse = NextResponse.redirect(
              new URL("/auth/complete-profile", req.url)
            );
            response.headers.forEach((value, key) => {
              redirectResponse.headers.set(key, value);
            });
            return redirectResponse;
          }
          if (!isApproved) {
            const redirectResponse = NextResponse.redirect(
              new URL("/pending", req.url)
            );
            response.headers.forEach((value, key) => {
              redirectResponse.headers.set(key, value);
            });
            return redirectResponse;
          }
          const redirectResponse = NextResponse.redirect(
            new URL("/dashboard/doctor", req.url)
          );
          response.headers.forEach((value, key) => {
            redirectResponse.headers.set(key, value);
          });
          return redirectResponse;
        }
      }
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes
        if (
          pathname.startsWith("/auth/") ||
          pathname === "/" ||
          pathname.startsWith("/api/auth/") ||
          pathname.startsWith("/_next/") ||
          pathname === "/favicon.ico" ||
          pathname.startsWith("/bot") // allow unauthenticated
        ) {
          return true;
        }

        // Otherwise, require login
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
