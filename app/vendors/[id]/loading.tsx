export default function VendorProfileLoading() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header skeleton */}
      <div className="h-16 bg-white border-b border-gray-100 animate-pulse" />

      {/* Hero image skeleton */}
      <div className="h-64 sm:h-80 bg-gray-200 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor info card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-7 bg-gray-200 rounded animate-pulse w-64" />
                <div className="w-5 h-5 bg-blue-100 rounded-full animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6" />
              </div>
            </div>

            {/* Services skeleton */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start p-4 border border-gray-100 rounded-xl"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-1/4" />
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews skeleton */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="space-y-2 p-4 border border-gray-100 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <div
                        key={j}
                        className="w-4 h-4 bg-yellow-100 rounded animate-pulse"
                      />
                    ))}
                  </div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="h-10 bg-accent/20 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
