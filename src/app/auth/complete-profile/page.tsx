"use client";

import { Suspense } from "react";
import LogoSpinnerOverlay from "@/components/LogoSpinnerOverlay";
import CompleteProfileForm from "@/components/auth/CompleteProfileForm";

export default function Page() {
  return (
    <Suspense fallback={<LogoSpinnerOverlay />}>
      <CompleteProfileForm/>
    </Suspense>
  );
}
