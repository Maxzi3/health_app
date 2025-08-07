"use client";

import React from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import { useRouter } from "next/navigation";

const PatientSignUpPage = () => {
  const router = useRouter();

  const handleSwitchToLogin = () => {
    router.push("/auth/login");
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <SignUpForm
      role="patient"
      onSwitchToLogin={handleSwitchToLogin}
      onBack={handleBack}
    />
  );
};

export default PatientSignUpPage;
