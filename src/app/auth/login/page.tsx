import LoginForm from "@/components/auth/LoginForm";
import LogoSpinnerOverlay from "@/components/LogoSpinnerOverlay";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<LogoSpinnerOverlay/>}>
      <LoginForm />
    </Suspense>
  );
}
