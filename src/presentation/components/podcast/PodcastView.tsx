"use client";

import { usePodcastPresenter } from "@/src/presentation/presenters/podcast/usePodcastPresenter";
import { Play, Plus, X } from "lucide-react";
import FullScreenPlayer from "./FullScreenPlayer";
import MiniPlayer from "./MiniPlayer";
import PodcastSkeletonView from "./PodcastSkeletonView";

/**
 * PodcastView
 * ✅ 100% logic-free - ONLY renders JSX
 * ✅ No useState, no useEffect, no useRef - All moved to usePodcastPresenter
 * ✅ EVERYTHING comes from the [state, actions] tuple
 * ✅ Thin Presentation Layer per Clean Architecture pattern
 */
export default function PodcastView() {
  // ✅ Hook returns EVERYTHING: state, actions, refs, helpers
  const [state, actions] = usePodcastPresenter();
  const { viewModel, loading, error, audioRef } = state;

  // Show loading state - match HomeView pattern: return just skeleton
  if (loading && !viewModel) {
    return <PodcastSkeletonView />;
  }

  // Show error state
  if (error && !viewModel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
        </div>
      </div>
    );
  }

  // No viewModel yet
  if (!viewModel) {
    return null;
  }

  const { surahs, initialized, currentItem, isFullScreen } = viewModel;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-white px-6 pt-8 pb-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">ฟังต่อเนื่อง</h1>
          <p className="text-glass-bg-hover text-sm">
            เลือกซูเราะห์เพื่อฟังแบบต่อเนื่อง
          </p>
        </div>
      </div>

      {/* Surah List */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          รายการซูเราะห์
        </h2>
        {!initialized || surahs.length === 0 ? (
          <PodcastSkeletonView />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {surahs.map((surah) => {
              const inQueue = viewModel.inQueue(surah.number);
              const isCurrent = currentItem?.surah.number === surah.number;

              return (
                <div
                  key={surah.number}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-primary/10 border-primary"
                      : "bg-card-bg border-card-border"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                      isCurrent
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {surah.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {surah.englishName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {surah.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Play Button - Play Immediately */}
                    <button
                      onClick={() =>
                        actions.handlePlayImmediately(surah.number)
                      }
                      className={`p-2 rounded-full transition-colors ${
                        isCurrent
                          ? "bg-primary text-white"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                      title="เล่นทันที"
                    >
                      <Play className="w-5 h-5" />
                    </button>

                    {/* Add/Remove from Queue Button */}
                    <button
                      onClick={() => actions.handleToggleQueue(surah.number)}
                      className={`p-2 rounded-full transition-colors ${
                        inQueue
                          ? "bg-muted text-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                      title={inQueue ? "เอาออกจากคิว" : "เพิ่มในคิว"}
                    >
                      {inQueue ? (
                        <X className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} preload="auto" />

      {/* Mini Player */}
      {currentItem && <MiniPlayer audioRef={audioRef} />}

      {/* Full Screen Player */}
      {isFullScreen && currentItem && <FullScreenPlayer audioRef={audioRef} />}
    </div>
  );
}
