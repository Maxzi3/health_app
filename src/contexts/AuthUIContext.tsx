"use client";

import React, { createContext, useContext, useState } from "react";

// Types
type AuthMode =
  | "/"
  | "role-selection"
  | "signup"
  | "login"
  | "forgot-password";
type UserRole = "doctor" | "patient" | null;

interface AuthUIContextProps {
  authMode: AuthMode;
  selectedRole: UserRole;
  handleGetStarted: () => void;
  handleRoleSelect: (role: UserRole) => void;
  handleBackHome: () => void;
  handleSwitchToLogin: () => void;
  handleSwitchToSignup: () => void;
  handleForgotPassword: () => void;
  handleBackToLogin: () => void;
}

// Create Context
const AuthUIContext = createContext<AuthUIContextProps | undefined>(undefined);

// Hook
export const useAuthUI = () => {
  const context = useContext(AuthUIContext);
  if (!context) {
    throw new Error("useAuthUI must be used within AuthUIProvider");
  }
  return context;
};

// Provider
export const AuthUIProvider = ({ children }: { children: React.ReactNode }) => {
  const [authMode, setAuthMode] = useState<AuthMode>("/");
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const handleGetStarted = () => setAuthMode("role-selection");
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAuthMode("signup");
  };
  const handleBackHome = () => {
    setAuthMode("/");
    setSelectedRole(null);
  };
  const handleSwitchToLogin = () => setAuthMode("login");
  const handleSwitchToSignup = () => setAuthMode("signup");
  const handleForgotPassword = () => setAuthMode("forgot-password");
  const handleBackToLogin = () => setAuthMode("login");

  return (
    <AuthUIContext.Provider
      value={{
        authMode,
        selectedRole,
        handleGetStarted,
        handleRoleSelect,
        handleBackHome,
        handleSwitchToLogin,
        handleSwitchToSignup,
        handleForgotPassword,
        handleBackToLogin,
      }}
    >
      {children}
    </AuthUIContext.Provider>
  );
};
