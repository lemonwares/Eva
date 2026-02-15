export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="h-16 bg-white border-b border-gray-100 animate-pulse" />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-28" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-56" />
        </div>

        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 space-y-4">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-44" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                <div className="h-10 bg-gray-50 rounded-lg animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                <div className="h-10 bg-gray-50 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
