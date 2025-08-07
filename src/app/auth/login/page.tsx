"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  const router = useRouter();

  const handleSwitchToSignup = () => {
    router.push("/auth");
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <LoginForm
      onSwitchToSignup={handleSwitchToSignup}
      onForgotPassword={handleForgotPassword}
      onBack={handleBack}
    />
  );
};

export default LoginPage;
