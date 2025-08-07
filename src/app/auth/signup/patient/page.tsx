"use client";

import React from "react";
import SignUpForm from "@/components/auth/SignUpForm";

const PatientSignUpPage = () => {
  const handleSwitchToLogin = () => {
    // Implement route navigation to login if using next/navigation
    console.log("Switch to login");
  };

  const handleBack = () => {
    // Implement route navigation to home or previous page
    console.log("Back to home");
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
