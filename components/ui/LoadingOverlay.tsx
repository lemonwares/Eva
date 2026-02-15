"use client";

import { LoaderCircle } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-foreground/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin">
          <LoaderCircle className="w-10 h-10 text-primary" />
        </div>
      </div>
    </div>
  );
}
