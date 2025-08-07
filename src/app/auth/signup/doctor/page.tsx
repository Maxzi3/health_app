"use client";

import React from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import { useRouter } from "next/navigation";

const DoctorSignUpPage = () => {
  const router = useRouter();

  const handleSwitchToLogin = () => {
    router.push("/auth/login");
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <SignUpForm
      role="doctor"
      onSwitchToLogin={handleSwitchToLogin}
      onBack={handleBack}
    />
  );
};

export default DoctorSignUpPage;
