"use client";

import React from "react";
import SignUpForm from "@/components/auth/SignUpForm";

const DoctorSignUpPage = () => {
  const handleSwitchToLogin = () => {
    // Implement route navigation to login
    console.log("Switch to login");
  };

  const handleBack = () => {
    // Implement route navigation to home or previous page
    console.log("Back to home");
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
