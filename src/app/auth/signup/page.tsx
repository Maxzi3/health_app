"use client";

import { Suspense } from "react";
import LogoSpinnerOverlay from "@/components/LogoSpinnerOverlay";
import SignupForm from "@/components/auth/SignUpForm";

export default function Page() {
  return (
    <Suspense fallback={<LogoSpinnerOverlay />}>
      <SignupForm />
    </Suspense>
  );
}
