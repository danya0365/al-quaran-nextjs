"use client";

import {
  getAllSurahsFromApi,
  getArabicSurahFromApi,
  getAudioForSurahFromApi,
} from "@/api/api";
import { usePodcastStore } from "@/store/podcastStore";
import { useQuranStore } from "@/store/quranStore";
import { Play, Plus, X } from "lucide-react";
import { useEffect, useRef } from "react";
import FullScreenPlayer from "./FullScreenPlayer";
import MiniPlayer from "./MiniPlayer";

export default function PodcastView() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    queue,
    currentQueueIndex,
    currentAyahIndex,
    isPlaying,
    playbackRate,
    isFullScreen,
    reciter,
    toggleSurahPlayback,
    removeFromQueue,
    playSurah,
    addToQueueOnly,
    playNext,
    playNextWithAutoLoad,
    setCurrentTime,
    setDuration,
    setIsPlaying,
  } = usePodcastStore();

  const currentItem = queue[currentQueueIndex];
  const currentAyah = currentItem?.ayahs[currentAyahIndex];

  // Use surah data from quranStore (single source of truth)
  const {
    surahs,
    initialized,
    setSurahs,
    setAvailableTranslations,
    setAvailableReciters,
    setInitialized,
  } = useQuranStore();

  // Fetch data if not initialized (same pattern as HomeView)
  useEffect(() => {
    if (!initialized || surahs.length === 0) {
      const fetchData = async () => {
        try {
          const data = await getAllSurahsFromApi(reciter);
          setSurahs(data);
          setInitialized(true);
        } catch (error) {
          console.error("Error fetching surahs:", error);
        }
      };
      fetchData();
    }
  }, [initialized, surahs.length, reciter, setSurahs, setInitialized]);

  // Play audio when currentAyah changes - same pattern as SurahView
  useEffect(() => {
    if (currentAyah && audioRef.current && isPlaying) {
      if (currentAyah.audio) {
        audioRef.current.src = currentAyah.audio;
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [currentAyah, isPlaying, playbackRate, setIsPlaying]);

  // Handle play/pause toggle (when user manually clicks play/pause)
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = async () => {
      // Use playNextWithAutoLoad to automatically load next surah when current ends
      await playNextWithAutoLoad(async () => {
        const { queue, currentQueueIndex } = usePodcastStore.getState();
        const currentItem = queue[currentQueueIndex];
        if (!currentItem) return null;

        // Calculate next surah number (1-114 loop)
        const nextSurahNumber =
          currentItem.surah.number >= 114 ? 1 : currentItem.surah.number + 1;

        try {
          const [arabicSurah, audioSurah] = await Promise.all([
            getArabicSurahFromApi(nextSurahNumber),
            getAudioForSurahFromApi(nextSurahNumber, reciter),
          ]);

          if (audioSurah?.ayahs) {
            return { surah: arabicSurah, ayahs: audioSurah.ayahs };
          }
        } catch (error) {
          console.error("Failed to load next surah:", error);
        }
        return null;
      });
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      // Auto-play when audio is ready (for auto-next)
      if (isPlaying) {
        audio.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [
    playNextWithAutoLoad,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    isPlaying,
    reciter,
  ]);

  // Handle play immediately (clear queue and play)
  const handlePlayImmediately = async (surahNumber: number) => {
    try {
      const [arabicSurah, audioSurah] = await Promise.all([
        getArabicSurahFromApi(surahNumber),
        getAudioForSurahFromApi(surahNumber, reciter),
      ]);

      if (audioSurah?.ayahs) {
        playSurah(arabicSurah, audioSurah.ayahs);
      }
    } catch (error) {
      console.error("Error loading surah:", error);
    }
  };

  // Handle toggle add/remove from queue (NO auto-play)
  const handleToggleQueue = async (surahNumber: number) => {
    if (isInQueue(surahNumber)) {
      removeFromQueue(surahNumber);
      return;
    }

    try {
      const [arabicSurah, audioSurah] = await Promise.all([
        getArabicSurahFromApi(surahNumber),
        getAudioForSurahFromApi(surahNumber, reciter),
      ]);

      if (audioSurah?.ayahs) {
        addToQueueOnly(arabicSurah, audioSurah.ayahs); // Just add, don't play
      }
    } catch (error) {
      console.error("Error loading surah:", error);
    }
  };

  const isInQueue = (surahNumber: number) => {
    return queue.some((item) => item.surah.number === surahNumber);
  };

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
          <div className="text-center py-12 text-muted-foreground">
            กำลังโหลดข้อมูลซูเราะห์...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {surahs.map((surah) => {
              const inQueue = isInQueue(surah.number);
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
                      onClick={() => handlePlayImmediately(surah.number)}
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
                      onClick={() => handleToggleQueue(surah.number)}
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
