export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="h-16 bg-white border-b border-gray-100 animate-pulse" />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Avatar & name skeleton */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-40" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-48" />
          </div>
        </div>

        {/* Form sections skeleton */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 space-y-4">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-36" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                  <div className="h-10 bg-gray-50 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
