export default function VendorBookingsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 bg-gray-200 rounded animate-pulse w-36" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-56" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-28 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center"
          >
            <div className="w-14 h-14 bg-gray-200 rounded-lg animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-48" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
            </div>
            <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
