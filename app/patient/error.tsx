"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PatientError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Patient page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
        <AlertCircle className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-lg font-semibold text-white">
        Something went wrong
      </h2>
      <p className="text-sm text-white/70 text-center max-w-md">
        Failed to load the patient form. Please try again.
      </p>
      <Button onClick={reset} variant="outline" className="gap-2 bg-white text-primary hover:bg-white/90">
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
