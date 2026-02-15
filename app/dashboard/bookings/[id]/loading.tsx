export default function BookingDetailLoading() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-7 w-48 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-36 bg-gray-200 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Vendor card */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5">
            <div className="flex gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-4 w-28 bg-gray-100 rounded" />
              </div>
            </div>
          </div>

          {/* Event details */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5">
            <div className="h-5 w-28 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded shrink-0" />
                  <div className="space-y-1">
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5">
            <div className="h-5 w-36 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Payment summary */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="h-5 w-36 bg-gray-200 rounded mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-16 bg-gray-100 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            ))}
            <div className="h-12 w-full bg-gray-200 rounded-xl mt-3" />
          </div>

          {/* Contact info */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="h-5 w-28 bg-gray-200 rounded mb-4" />
            <div className="h-4 w-40 bg-gray-100 rounded" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <div className="h-10 w-full bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
