"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      // Not authenticated, redirect to login
      router.replace("/auth/login");
      return;
    }

    const { role, isApproved, needsProfileCompletion } = session.user;

    // Handle redirects based on user role and status
    if (role === "PATIENT") {
      router.replace("/bot");
    } else if (role === "DOCTOR") {
      if (needsProfileCompletion) {
        router.replace("/auth/complete-profile");
      } else if (!isApproved) {
        router.replace("/pending");
      } else {
        router.replace("/dashboard");
      }
    } else {
      // Fallback for any edge cases
      router.replace("/auth/login");
    }
  }, [session, status, router]);

  // Show loading spinner while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
