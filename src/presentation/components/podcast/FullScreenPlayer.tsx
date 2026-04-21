"use client";

import { usePodcastStore } from "@/store/podcastStore";
import { useQuranStore } from "@/store/quranStore";
import { Minimize2, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import {
  Amiri,
  Lateef,
  Markazi_Text,
  Reem_Kufi,
  Scheherazade_New,
  Tajawal,
} from "next/font/google";
import { RefObject, useEffect } from "react";

// Arabic fonts - same as SurahView
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });
const lateef = Lateef({ subsets: ["arabic"], weight: ["400"] });
const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
});
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "700"] });
const reemKufi = Reem_Kufi({ subsets: ["arabic"], weight: ["400", "700"] });
const markazi = Markazi_Text({ subsets: ["arabic"], weight: ["400", "700"] });

interface FullScreenPlayerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
}

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];

export default function FullScreenPlayer({ audioRef }: FullScreenPlayerProps) {
  const {
    queue,
    currentQueueIndex,
    currentAyahIndex,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    toggleFullScreen,
    playPause,
    playNext,
    playPrev,
    setPlaybackRate,
    setCurrentTime,
  } = usePodcastStore();

  // Get Quran settings for Arabic font
  const { settings } = useQuranStore();

  // Calculate Arabic font class based on settings
  const arabicFontClass =
    settings.fontFamily === "Lateef"
      ? lateef.className
      : settings.fontFamily === "ScheherazadeNew"
        ? scheherazade.className
        : settings.fontFamily === "Tajawal"
          ? tajawal.className
          : settings.fontFamily === "ReemKufi"
            ? reemKufi.className
            : settings.fontFamily === "MarkaziText"
              ? markazi.className
              : amiri.className;

  const currentItem = queue[currentQueueIndex];
  const currentAyah = currentItem?.ayahs[currentAyahIndex];

  useEffect(() => {
    if ("mediaSession" in navigator && currentItem && currentAyah) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `อายะห์ที่ ${currentAyah.numberInSurah}`,
        artist: currentItem.surah.englishName,
        album: "Al-Quran",
      });

      navigator.mediaSession.setActionHandler("play", playPause);
      navigator.mediaSession.setActionHandler("pause", playPause);
      navigator.mediaSession.setActionHandler("nexttrack", playNext);
      navigator.mediaSession.setActionHandler("previoustrack", playPrev);
    }
  }, [currentItem, currentAyah, playPause, playNext, playPrev]);

  if (!currentItem || !currentAyah) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const prevAyah =
    currentAyahIndex > 0 ? currentItem.ayahs[currentAyahIndex - 1] : null;
  const nextAyah =
    currentAyahIndex < currentItem.ayahs.length - 1
      ? currentItem.ayahs[currentAyahIndex + 1]
      : null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
        <button
          onClick={toggleFullScreen}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <Minimize2 className="w-6 h-6 text-foreground" />
        </button>

        <div className="text-center flex-1 mx-4">
          <h2 className="font-semibold text-foreground truncate">
            {currentItem.surah.englishName}
          </h2>
          <p className="text-sm text-muted-foreground">
            ซูเราะห์ที่ {currentItem.surah.number}
          </p>
        </div>

        <button
          onClick={toggleFullScreen}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Synced Text */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {prevAyah && (
          <div className="text-center mb-4 opacity-40">
            <p
              className={`text-lg text-foreground ${arabicFontClass}`}
              dir="rtl"
              style={{ fontSize: `${Math.max(settings.fontSize - 4, 14)}px` }}
            >
              {prevAyah.text}
            </p>
          </div>
        )}

        <div className="text-center py-8 px-6 bg-primary/5 rounded-2xl border border-primary/20">
          <p
            className={`text-3xl font-semibold text-foreground leading-relaxed ${arabicFontClass}`}
            dir="rtl"
            style={{ fontSize: `${settings.fontSize + 8}px` }}
          >
            {currentAyah.text}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-sm font-bold">
              {currentAyah.numberInSurah}
            </span>
          </div>
        </div>

        {nextAyah && (
          <div className="text-center mt-4 opacity-40">
            <p
              className={`text-lg text-foreground ${arabicFontClass}`}
              dir="rtl"
              style={{ fontSize: `${Math.max(settings.fontSize - 4, 14)}px` }}
            >
              {nextAyah.text}
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-6 pb-8 pt-4 border-t border-card-border">
        {/* Progress */}
        <div className="mb-6">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: "var(--color-primary)" }}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={playPrev}
            className="p-3 rounded-full bg-muted text-foreground hover:bg-muted-dark transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={playPause}
            className="p-4 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>

          <button
            onClick={playNext}
            className="p-3 rounded-full bg-muted text-foreground hover:bg-muted-dark transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center justify-center gap-1 bg-muted rounded-full p-1 mb-4 max-w-fit mx-auto">
          {PLAYBACK_RATES.map((rate) => (
            <button
              key={rate}
              onClick={() => setPlaybackRate(rate)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                playbackRate === rate
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Queue Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            คิวที่ {currentQueueIndex + 1} / {queue.length}
          </span>
          <span>
            อายะห์ที่ {currentAyahIndex + 1} / {currentItem.ayahs.length}
          </span>
        </div>
      </div>
    </div>
  );
}
