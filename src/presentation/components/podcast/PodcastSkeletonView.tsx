export default function PodcastSkeletonView() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton - Same style as HomeView */}
      <div className="bg-primary text-white px-6 pt-8 pb-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-32 bg-glass-bg rounded animate-pulse mb-2"></div>
          <div className="h-4 w-48 bg-glass-bg-subtle rounded animate-pulse"></div>
        </div>
      </div>

      {/* List Header Skeleton */}
      <div className="max-w-4xl mx-auto px-6 py-6 mb-4">
        <div className="h-6 w-48 bg-muted rounded animate-pulse"></div>
      </div>

      {/* Surah List Skeleton - Full coverage like HomeView */}
      <div className="max-w-4xl mx-auto px-6 space-y-3 pb-24">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-card-bg rounded-xl shadow-sm p-4 border border-card-border"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-xl flex-shrink-0 animate-pulse"></div>
              <div className="flex-1 min-w-0">
                <div className="h-5 w-32 bg-muted rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-48 bg-muted-light rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-9 h-9 bg-muted rounded-full animate-pulse"></div>
                <div className="w-9 h-9 bg-muted rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
