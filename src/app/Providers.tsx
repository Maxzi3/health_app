"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import LogoSpinnerOverlay from "@/components/LogoSpinnerOverlay";
import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";

function AuthLoaderWrapper({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const isLoading = status === "loading";

  return (
    <>
      <LogoSpinnerOverlay active={isLoading} />
      {children}
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <SessionProvider
        refetchInterval={0} // ⛔ disable polling completely
        refetchOnWindowFocus={false} // ⛔ no refetch when tab gains focus
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthLoaderWrapper>{children}</AuthLoaderWrapper>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
