export default function BookingsLoading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 bg-gray-200 rounded animate-pulse w-36" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-64" />
      </div>

      {/* Filters skeleton */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Booking cards skeleton */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-48" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
            </div>
            <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
