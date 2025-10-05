export default function SurahSkeletonView() {
  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background:
          "linear-gradient(to bottom, rgba(16,185,129,0.06), #ffffff)",
      }}
    >
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 pt-8 pb-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            {/* Back button skeleton */}
            <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>

            {/* Settings buttons skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-24 h-10 bg-white/20 rounded-full animate-pulse"></div>
              <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="text-center">
            {/* English name */}
            <div className="h-7 w-32 bg-white/30 rounded mx-auto mb-3 animate-pulse"></div>
            {/* Arabic name */}
            <div className="h-9 w-40 bg-white/30 rounded mx-auto mb-3 animate-pulse"></div>
            {/* Description */}
            <div className="h-4 w-56 bg-white/20 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Ayahs Skeleton */}
      <div className="max-w-4xl mx-auto flex flex-col gap-6 p-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            {/* Arabic Text Skeleton */}
            <div className="mb-4 space-y-3">
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-11/12 bg-gray-200 rounded animate-pulse ml-auto"></div>
              <div className="h-6 w-10/12 bg-gray-200 rounded animate-pulse ml-auto"></div>
              <div className="flex items-center gap-2 justify-end">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Translation Skeleton */}
            <div className="mb-4 space-y-2">
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
              <div className="h-4 w-11/12 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-4 w-9/12 bg-gray-100 rounded animate-pulse"></div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-5 w-12 bg-gray-100 rounded ml-auto animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
