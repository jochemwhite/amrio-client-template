"use client";

import { useEffect } from "react";

import {
  RouteStatus,
  RouteStatusButton,
} from "@/components/app/route-status";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteStatus
      eyebrow="Something Went Wrong"
      title="The page could not be rendered"
      description="An unexpected application error interrupted rendering. You can retry the request, and if the issue persists, inspect the server logs using the digest below."
    >
      <div className="grid gap-4">
        <div className="text-sm text-muted">
          {error.digest ? `Error digest: ${error.digest}` : "No error digest was provided."}
        </div>
        <div>
          <RouteStatusButton onClick={() => unstable_retry()}>
            Try again
          </RouteStatusButton>
        </div>
      </div>
    </RouteStatus>
  );
}
