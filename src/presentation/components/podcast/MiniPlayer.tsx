"use client";

import { usePodcastStore } from "@/store/podcastStore";
import { Maximize2, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { RefObject } from "react";

interface MiniPlayerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
}

export default function MiniPlayer({ audioRef }: MiniPlayerProps) {
  const {
    queue,
    currentQueueIndex,
    currentAyahIndex,
    isPlaying,
    currentTime,
    duration,
    toggleFullScreen,
    playPause,
    playNext,
    playPrev,
  } = usePodcastStore();

  const currentItem = queue[currentQueueIndex];
  const currentAyah = currentItem?.ayahs[currentAyahIndex];

  if (!currentItem || !currentAyah) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-glass-bg backdrop-blur-lg border border-glass-border rounded-2xl shadow-lg overflow-hidden">
          {/* Progress Bar */}
          <div
            className="h-1 bg-glass-bg-subtle cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="px-4 py-3 flex items-center gap-3">
            {/* Surah Info */}
            <button
              onClick={toggleFullScreen}
              className="flex-1 min-w-0 text-left"
            >
              <p className="font-semibold text-foreground text-sm truncate">
                {currentItem.surah.englishName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                อายะห์ที่ {currentAyah.numberInSurah} /{" "}
                {currentItem.surah.ayahs?.length || "?"}
              </p>
            </button>

            {/* Time */}
            <div className="text-xs text-muted-foreground hidden sm:block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={playPrev}
                className="w-10 h-10 rounded-full text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={playPause}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <button
                onClick={playNext}
                className="w-10 h-10 rounded-full text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={toggleFullScreen}
                className="w-10 h-10 rounded-full text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
