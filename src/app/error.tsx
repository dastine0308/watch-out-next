"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-800">
          Something went wrong!
        </h2>
        <p className="mb-6 text-slate-600">{error.message}</p>
        <Button onClick={reset} variant="default">
          Try again
        </Button>
      </div>
    </div>
  );
}

