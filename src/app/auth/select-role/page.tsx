import RoleSelection from "@/components/auth/RoleSelection";
import LogoSpinnerOverlay from "@/components/LogoSpinnerOverlay";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<LogoSpinnerOverlay/>}>
      <RoleSelection/>
    </Suspense>
  );
}
