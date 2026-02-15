"use client";

import { AlertOctagon, RefreshCw } from "lucide-react";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backgroundColor: "#fafafa",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Error Icon */}
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              backgroundColor: "#d4f0f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <AlertOctagon
              style={{ width: "48px", height: "48px", color: "#0097b2" }}
            />
          </div>

          {/* Error Message */}
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#111",
              marginBottom: "0.75rem",
              textAlign: "center",
            }}
          >
            Critical Error
          </h1>
          <p
            style={{
              color: "#666",
              textAlign: "center",
              maxWidth: "400px",
              marginBottom: "0.5rem",
            }}
          >
            A critical error has occurred. Please try refreshing the page.
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#999",
                marginBottom: "2rem",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}

          {/* Try Again Button */}
          <button
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              backgroundColor: "#0097b2",
              color: "white",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            <RefreshCw style={{ width: "18px", height: "18px" }} />
            Try Again
          </button>

          {/* EVA Branding */}
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#0097b2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
            >
              EVA
            </div>
            <span style={{ color: "#999", fontSize: "0.875rem" }}>
              Event Vendor Atlas
            </span>
          </div>
        </div>
      </body>
    </html>
  );
}
