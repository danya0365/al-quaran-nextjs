export default function SurahSkeletonView() {
  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header Skeleton */}
      <div className="bg-primary text-white px-6 pt-8 pb-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            {/* Back button skeleton */}
            <div className="w-10 h-10 bg-glass-bg rounded-full animate-pulse"></div>

            {/* Settings buttons skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-24 h-10 bg-glass-bg rounded-full animate-pulse"></div>
              <div className="w-10 h-10 bg-glass-bg rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="text-center">
            {/* English name */}
            <div className="h-7 w-32 bg-glass-bg-hover rounded mx-auto mb-3 animate-pulse"></div>
            {/* Arabic name */}
            <div className="h-9 w-40 bg-glass-bg-hover rounded mx-auto mb-3 animate-pulse"></div>
            {/* Description */}
            <div className="h-4 w-56 bg-glass-bg rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Ayahs Skeleton */}
      <div className="max-w-4xl mx-auto flex flex-col gap-6 p-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-card-bg rounded-2xl shadow-sm p-6 border border-card-border"
          >
            {/* Arabic Text Skeleton */}
            <div className="mb-4 space-y-3">
              <div className="h-6 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-6 w-11/12 bg-muted rounded animate-pulse ml-auto"></div>
              <div className="h-6 w-10/12 bg-muted rounded animate-pulse ml-auto"></div>
              <div className="flex items-center gap-2 justify-end">
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Translation Skeleton */}
            <div className="mb-4 space-y-2">
              <div className="h-4 w-full bg-muted-light rounded animate-pulse"></div>
              <div className="h-4 w-11/12 bg-muted-light rounded animate-pulse"></div>
              <div className="h-4 w-9/12 bg-muted-light rounded animate-pulse"></div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex items-center gap-2 pt-4 border-t border-card-border">
              <div className="h-9 w-20 bg-muted rounded-lg animate-pulse"></div>
              <div className="h-9 w-24 bg-muted rounded-lg animate-pulse"></div>
              <div className="h-5 w-12 bg-muted-light rounded ml-auto animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
