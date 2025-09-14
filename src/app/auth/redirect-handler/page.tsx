"use client";

import LogoSpinnerOverlay from "@/components/LogoSpinnerOverlay";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function RedirectHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (status === "loading") return; // Still loading session

    if (!session) {
      router.replace("/auth/login");
      return;
    }

    const { role, isApproved, needsProfileCompletion } = session.user;

    if (role === "PATIENT") {
      router.replace("/bot");
    } else if (role === "DOCTOR") {
      if (needsProfileCompletion) {
        router.replace("/auth/complete-profile");
      } else if (!isApproved) {
        router.replace("/pending");
      } else {
        router.replace("/dashboard/doctor");
      }
    } else {
      router.replace("/auth/login");
    }

    // Once router kicks in, show loader until redirect completes
    setRedirecting(true);
  }, [session, status, router]);

  return <LogoSpinnerOverlay active={redirecting || status === "loading"} />;
}
