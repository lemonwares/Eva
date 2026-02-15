"use client";

import Skeleton from "./Skeleton";

interface SearchResultSkeletonProps {
  viewMode: "grid" | "list";
}

export default function SearchResultSkeleton({ viewMode }: SearchResultSkeletonProps) {
  if (viewMode === "grid") {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Image placeholder */}
        <Skeleton className="aspect-4/3 w-full rounded-none" />
        
        {/* Content placeholder */}
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between items-center pt-2">
             <Skeleton className="h-6 w-1/4" />
             <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 rounded-xl border border-border bg-card">
      {/* Image placeholder */}
      <Skeleton className="w-32 sm:w-48 aspect-square rounded-lg shrink-0" />
      
      {/* Content placeholder */}
      <div className="flex-1 space-y-3 py-1">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-5 w-1/4" />
        </div>
      </div>
    </div>
  );
}
