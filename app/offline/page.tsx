"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          You&apos;re Offline
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          It looks like you&apos;ve lost your internet connection. Please check
          your network settings and try again.
        </p>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </button>

        {/* Tips */}
        <div className="mt-12 text-left bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Things you can try:
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center shrink-0 text-sm font-medium">
                1
              </span>
              <span>Check if your Wi-Fi or mobile data is turned on</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center shrink-0 text-sm font-medium">
                2
              </span>
              <span>Try moving closer to your router</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center shrink-0 text-sm font-medium">
                3
              </span>
              <span>Restart your device and try again</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center shrink-0 text-sm font-medium">
                4
              </span>
              <span>
                Contact your internet service provider if the problem persists
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-500">EVA - Event Vendor App</p>
      </div>
    </div>
  );
}
