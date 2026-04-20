export default function HomeSkeletonView() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-primary text-white px-6 pt-8 pb-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-9 w-32 bg-glass-bg rounded animate-pulse mb-2"></div>
              <div className="h-4 w-40 bg-glass-bg-subtle rounded animate-pulse"></div>
            </div>
            <div className="w-12 h-12 bg-glass-bg rounded-full animate-pulse"></div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="h-12 w-full bg-glass-bg-hover rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="max-w-4xl mx-auto px-6 -mt-4 mb-6">
        <div className="bg-card-bg rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-9 w-16 bg-muted rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 w-12 bg-muted-light rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* List Header Skeleton */}
      <div className="max-w-4xl mx-auto px-6 mb-4">
        <div className="h-6 w-48 bg-muted rounded animate-pulse"></div>
      </div>

      {/* Surah List Skeleton */}
      <div className="max-w-4xl mx-auto px-6 space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-card-bg rounded-xl shadow-sm p-4 border border-card-border"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-xl flex-shrink-0 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-5 w-32 bg-muted rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-48 bg-muted-light rounded animate-pulse"></div>
              </div>
              <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
