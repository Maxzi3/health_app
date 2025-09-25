"use client";

import { Suspense } from "react";
import LogoSpinnerOverlay from "@/components/LogoSpinnerOverlay";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function Page() {
  return (
    <Suspense fallback={<LogoSpinnerOverlay />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
