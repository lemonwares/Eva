export default function VendorDashboardLoading() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 bg-gray-200 rounded animate-pulse w-56" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-72" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4 space-y-3"
          >
            <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-3 bg-gray-50 rounded animate-pulse w-20" />
          </div>
        ))}
      </div>

      {/* Content area skeleton */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-44" />
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 items-center py-3 border-b border-gray-100 last:border-0"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
            </div>
            <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
