import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSession } from "next-auth/react";

interface AuthState {
  // Remove token management - NextAuth handles this
  tempCredentials: { email: string; password: string } | null;
  setTempCredentials: (
    credentials: { email: string; password: string } | null
  ) => void;
  clearTempCredentials: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tempCredentials: null,
      setTempCredentials: (credentials) =>
        set({ tempCredentials: credentials }),
      clearTempCredentials: () => set({ tempCredentials: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ tempCredentials: state.tempCredentials }),
    }
  )
);

// Custom hook to get user from NextAuth session
export const useAuthUser = () => {
  const { data: session, status } = useSession();
  return {
    user: session?.user || null,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
  };
};
