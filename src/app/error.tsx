"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global route error:", error);
    // TODO: send to Sentry or monitoring
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="text-sm text-muted-foreground mb-4">
            We couldn’t load this page. Please try again.
          </p>
          <Button onClick={reset} size="sm">
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
