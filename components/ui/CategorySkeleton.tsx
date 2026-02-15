"use client";

import Skeleton from "./Skeleton";

export default function CategorySkeleton() {
  return (
    <div className="shrink-0 w-[280px] sm:w-[320px] space-y-4">
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
        <Skeleton className="h-full w-full" />
        
        {/* text overlay skeleton */}
        <div className="absolute inset-x-0 bottom-0 p-5 space-y-2">
          <Skeleton className="h-6 w-1/2 bg-white/20" />
          <Skeleton className="h-4 w-3/4 bg-white/10" />
        </div>
      </div>
    </div>
  );
}
