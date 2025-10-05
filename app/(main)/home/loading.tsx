export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 pt-8 pb-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-9 w-32 bg-white/20 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-40 bg-white/10 rounded animate-pulse"></div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse"></div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="h-12 w-full bg-white/90 rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="max-w-4xl mx-auto px-6 -mt-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-9 w-16 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-100 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* List Header Skeleton */}
      <div className="max-w-4xl mx-auto px-6 mb-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Surah List Skeleton */}
      <div className="max-w-4xl mx-auto px-6 space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex-shrink-0 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-100 rounded animate-pulse"></div>
              </div>
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
