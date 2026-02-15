export default function AdminLoading() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-80" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
              <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
            </div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
            <div className="h-3 bg-gray-50 rounded animate-pulse w-32" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-36" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b border-gray-50"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-40" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-56" />
            </div>
            <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
