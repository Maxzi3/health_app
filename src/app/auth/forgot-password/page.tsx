"use client";

import { useRouter } from "next/navigation";
import ForgotPasswordForm from "@/components/auth/ForgetPassword";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  return <ForgotPasswordForm onBackToLogin={handleBackToLogin} />;
};

export default ForgotPasswordPage;
