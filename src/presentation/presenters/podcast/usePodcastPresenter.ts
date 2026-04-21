"use client";

import {
  getAllSurahsFromApi,
  getArabicSurahFromApi,
  getAudioForSurahFromApi,
} from "@/api/api";
import { usePodcastStore } from "@/store/podcastStore";
import { useQuranStore } from "@/store/quranStore";
import { Ayah, Surah } from "@/types/quran";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface PodcastViewModel {
  surahs: Surah[];
  initialized: boolean;
  currentItem: { surah: Surah; ayahs: Ayah[] } | null;
  currentAyah: Ayah | null;
  isPlaying: boolean;
  isFullScreen: boolean;
  inQueue: (surahNumber: number) => boolean;
}

export interface PodcastPresenterState {
  viewModel: PodcastViewModel | null;
  loading: boolean;
  error: string | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export interface PodcastPresenterActions {
  handlePlayImmediately: (surahNumber: number) => Promise<void>;
  handlePlayWithFullScreen: (surahNumber: number) => Promise<void>;
  handleToggleQueue: (surahNumber: number) => Promise<void>;
  retryLoad: () => Promise<void>;
}

/**
 * usePodcastPresenter
 * ✅ 100% of logic lives here - NOT in the View component
 * ✅ Contains: useState, useEffect, useRef, API calls, handlers
 * ✅ Returns [state, actions] tuple for View to consume
 */
export function usePodcastPresenter(): [
  PodcastPresenterState,
  PodcastPresenterActions,
] {
  // ==========================================
  // STORES
  // ==========================================
  const {
    queue,
    currentQueueIndex,
    currentAyahIndex,
    isPlaying,
    playbackRate,
    isFullScreen,
    reciter,
    removeFromQueue,
    playSurah,
    playSurahWithFullScreen,
    addToQueueOnly,
    playNextWithAutoLoad,
    setCurrentTime,
    setDuration,
    setIsPlaying,
  } = usePodcastStore();

  const { surahs, initialized, setSurahs, setInitialized } = useQuranStore();

  // ==========================================
  // REFS (MOVED FROM VIEW - Pattern Rule: No refs in View)
  // ==========================================
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMountedRef = useRef(true);

  // ==========================================
  // LOCAL STATE (for loading/error)
  // ==========================================
  const [loading, setLoading] = useState(!initialized);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // DERIVED STATE
  // ==========================================
  const currentItem = useMemo(
    () => queue[currentQueueIndex] || null,
    [queue, currentQueueIndex],
  );

  const currentAyah = useMemo(
    () => currentItem?.ayahs[currentAyahIndex] || null,
    [currentItem, currentAyahIndex],
  );

  const inQueue = useCallback(
    (surahNumber: number) => {
      return queue.some((item) => item.surah.number === surahNumber);
    },
    [queue],
  );

  // ==========================================
  // DATA LOADING (MOVED FROM VIEW)
  // ==========================================
  const loadData = useCallback(async () => {
    if (initialized && surahs.length > 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getAllSurahsFromApi(reciter);
      setSurahs(data);
      setInitialized(true);
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [initialized, surahs.length, reciter, setSurahs, setInitialized]);

  // ==========================================
  // AUDIO EFFECTS (MOVED FROM VIEW)
  // ==========================================

  // Play audio when currentAyah changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAyah || !isPlaying) return;

    if (currentAyah.audio) {
      audio.src = currentAyah.audio;
      audio.playbackRate = playbackRate;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, [currentAyah, isPlaying, playbackRate]);

  // Handle play/pause toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    } else {
      audio.pause();
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
      await playNextWithAutoLoad(async () => {
        const { queue, currentQueueIndex } = usePodcastStore.getState();
        const currentItem = queue[currentQueueIndex];
        if (!currentItem) return null;

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

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    if (!initialized || surahs.length === 0) {
      loadData();
    }
  }, [initialized, surahs.length, loadData]);

  // ==========================================
  // CLEANUP
  // ==========================================
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ==========================================
  // ACTIONS (MOVED FROM VIEW)
  // ==========================================
  const handlePlayImmediately = useCallback(
    async (surahNumber: number) => {
      try {
        const [arabicSurah, audioSurah] = await Promise.all([
          getArabicSurahFromApi(surahNumber),
          getAudioForSurahFromApi(surahNumber, reciter),
        ]);

        if (audioSurah?.ayahs) {
          playSurah(arabicSurah, audioSurah.ayahs);
        }
      } catch (err) {
        console.error("Error loading surah:", err);
        setError(err instanceof Error ? err.message : "Failed to play surah");
      }
    },
    [reciter, playSurah],
  );

  const handlePlayWithFullScreen = useCallback(
    async (surahNumber: number) => {
      try {
        const [arabicSurah, audioSurah] = await Promise.all([
          getArabicSurahFromApi(surahNumber),
          getAudioForSurahFromApi(surahNumber, reciter),
        ]);

        if (audioSurah?.ayahs) {
          playSurahWithFullScreen(arabicSurah, audioSurah.ayahs);
        }
      } catch (err) {
        console.error("Error loading surah:", err);
        setError(err instanceof Error ? err.message : "Failed to play surah");
      }
    },
    [reciter, playSurahWithFullScreen],
  );

  const handleToggleQueue = useCallback(
    async (surahNumber: number) => {
      if (inQueue(surahNumber)) {
        removeFromQueue(surahNumber);
        return;
      }

      try {
        const [arabicSurah, audioSurah] = await Promise.all([
          getArabicSurahFromApi(surahNumber),
          getAudioForSurahFromApi(surahNumber, reciter),
        ]);

        if (audioSurah?.ayahs) {
          addToQueueOnly(arabicSurah, audioSurah.ayahs);
        }
      } catch (err) {
        console.error("Error loading surah:", err);
        setError(err instanceof Error ? err.message : "Failed to add to queue");
      }
    },
    [reciter, inQueue, removeFromQueue, addToQueueOnly],
  );

  const retryLoad = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // ==========================================
  // BUILD VIEW MODEL (null when not initialized)
  // ==========================================
  const viewModel: PodcastViewModel | null = useMemo(() => {
    if (!initialized || surahs.length === 0) {
      return null;
    }
    return {
      surahs,
      initialized,
      currentItem,
      currentAyah,
      isPlaying,
      isFullScreen,
      inQueue,
    };
  }, [
    surahs,
    initialized,
    currentItem,
    currentAyah,
    isPlaying,
    isFullScreen,
    inQueue,
  ]);

  // ==========================================
  // RETURN [STATE, ACTIONS] TUPLE
  // ==========================================
  return [
    {
      viewModel,
      loading,
      error,
      audioRef, // ✅ REF comes from hook, not View
    },
    {
      handlePlayImmediately,
      handlePlayWithFullScreen,
      handleToggleQueue,
      retryLoad,
    },
  ];
}
