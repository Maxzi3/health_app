"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({
  className = "text-red-600 hover:text-red-800 ",
  children = "Sign Out",
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut({
        callbackUrl: "/auth/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`${className} flex mx-auto disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? "Signing out..." : children}
    </button>
  );
}
