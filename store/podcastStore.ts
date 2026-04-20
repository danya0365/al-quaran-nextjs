import { Ayah, Surah } from "@/types/quran";
import localforage from "localforage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const localForageStorage = {
  getItem: async (name: string) => {
    const value = await localforage.getItem(name);
    return value ? JSON.parse(value as string) : null;
  },
  setItem: async (name: string, value: any) => {
    await localforage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await localforage.removeItem(name);
  },
};

export interface QueueItem {
  surah: Surah;
  ayahs: Ayah[];
}

export interface PodcastState {
  // Queue
  queue: QueueItem[];
  currentQueueIndex: number;

  // Playback
  currentAyahIndex: number;
  isPlaying: boolean;
  audioUrl: string | null;
  currentTime: number;
  duration: number;
  playbackRate: number;

  // UI
  isFullScreen: boolean;
  reciter: string;

  // Actions
  playSurah: (surah: Surah, ayahs: Ayah[]) => void;
  removeFromQueue: (surahNumber: number) => void;
  toggleSurahPlayback: (surah: Surah, ayahs: Ayah[]) => void;
  playNext: () => void;
  playNextWithAutoLoad: (
    loadNextSurah: () => Promise<{ surah: Surah; ayahs: Ayah[] } | null>,
  ) => Promise<void>;
  playPrev: () => void;
  playPause: () => void;
  setAudioUrl: (url: string | null) => void;
  setCurrentAyahIndex: (index: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleFullScreen: () => void;
  setIsPlaying: (playing: boolean) => void;
  clearQueue: () => void;
}

export const usePodcastStore = create<PodcastState>()(
  persist(
    (set, get) => ({
      // Initial state
      queue: [],
      currentQueueIndex: 0,
      currentAyahIndex: 0,
      isPlaying: false,
      audioUrl: null,
      currentTime: 0,
      duration: 0,
      playbackRate: 1,
      isFullScreen: false,
      reciter: "ar.alafasy",

      // Actions
      playSurah: (surah: Surah, ayahs: Ayah[]) => {
        // Clear queue and play selected surah immediately
        set({
          queue: [{ surah, ayahs }],
          currentQueueIndex: 0,
          currentAyahIndex: 0,
          isPlaying: true,
          currentTime: 0,
          duration: 0,
        });
      },

      removeFromQueue: (surahNumber: number) => {
        const { queue, currentQueueIndex } = get();
        const index = queue.findIndex(
          (item) => item.surah.number === surahNumber,
        );

        if (index === -1) return;

        // If removing current playing item
        if (index === currentQueueIndex) {
          set({ isPlaying: false, currentTime: 0 });
        }

        const newQueue = queue.filter((_, i) => i !== index);

        // Adjust current index if needed
        let newCurrentIndex = currentQueueIndex;
        if (index < currentQueueIndex) {
          newCurrentIndex = currentQueueIndex - 1;
        } else if (index === currentQueueIndex && newQueue.length > 0) {
          // Keep same index but it now points to next item
          newCurrentIndex = Math.min(currentQueueIndex, newQueue.length - 1);
        }

        set({
          queue: newQueue,
          currentQueueIndex: newCurrentIndex,
        });
      },

      toggleSurahPlayback: (surah: Surah, ayahs: Ayah[]) => {
        const { queue, currentQueueIndex, isPlaying } = get();
        const currentItem = queue[currentQueueIndex];

        // If clicking the currently playing surah
        if (currentItem?.surah.number === surah.number) {
          set({ isPlaying: !isPlaying });
          return;
        }

        // If surah is in queue but not playing, switch to it
        const queueIndex = queue.findIndex(
          (item) => item.surah.number === surah.number,
        );
        if (queueIndex !== -1) {
          set({
            currentQueueIndex: queueIndex,
            currentAyahIndex: 0,
            isPlaying: true,
            currentTime: 0,
            duration: 0,
          });
          return;
        }

        // Otherwise add to queue and play
        const { playSurah } = get();
        playSurah(surah, ayahs);
      },

      playNext: () => {
        const { queue, currentQueueIndex, currentAyahIndex } = get();
        const currentItem = queue[currentQueueIndex];

        if (!currentItem) return;

        // Try next ayah in current surah
        if (currentAyahIndex < currentItem.ayahs.length - 1) {
          set({ currentAyahIndex: currentAyahIndex + 1, isPlaying: true });
          return;
        }

        // Try next surah in queue
        if (currentQueueIndex < queue.length - 1) {
          set({
            currentQueueIndex: currentQueueIndex + 1,
            currentAyahIndex: 0,
            currentTime: 0,
            duration: 0,
            isPlaying: true,
          });
          return;
        }

        // End of queue - stop playing
        set({ isPlaying: false, currentTime: 0 });
      },

      playNextWithAutoLoad: async (
        loadNextSurah: () => Promise<{ surah: Surah; ayahs: Ayah[] } | null>,
      ) => {
        const { queue, currentQueueIndex, currentAyahIndex } = get();
        const currentItem = queue[currentQueueIndex];

        if (!currentItem) return;

        // Try next ayah in current surah
        if (currentAyahIndex < currentItem.ayahs.length - 1) {
          set({ currentAyahIndex: currentAyahIndex + 1, isPlaying: true });
          return;
        }

        // Try next surah in queue
        if (currentQueueIndex < queue.length - 1) {
          set({
            currentQueueIndex: currentQueueIndex + 1,
            currentAyahIndex: 0,
            currentTime: 0,
            duration: 0,
            isPlaying: true,
          });
          return;
        }

        // End of current surah - auto load next surah (Surah 114 loops back to 1)
        const nextSurahNumber =
          currentItem.surah.number >= 114 ? 1 : currentItem.surah.number + 1;

        try {
          // We need to load the next surah from the component
          // This is handled by the callback
          const nextSurahData = await loadNextSurah();

          if (nextSurahData) {
            // Replace queue with next surah and play
            set({
              queue: [nextSurahData],
              currentQueueIndex: 0,
              currentAyahIndex: 0,
              currentTime: 0,
              duration: 0,
              isPlaying: true,
            });
          } else {
            // Failed to load - stop playing
            set({ isPlaying: false, currentTime: 0 });
          }
        } catch (error) {
          console.error("Failed to auto-load next surah:", error);
          set({ isPlaying: false, currentTime: 0 });
        }
      },

      playPrev: () => {
        const { queue, currentQueueIndex, currentAyahIndex } = get();
        const currentItem = queue[currentQueueIndex];

        if (!currentItem) return;

        // Try previous ayah in current surah (go back 10s or prev ayah)
        if (currentAyahIndex > 0) {
          set({ currentAyahIndex: currentAyahIndex - 1, isPlaying: true });
          return;
        }

        // Try previous surah in queue
        if (currentQueueIndex > 0) {
          const prevItem = queue[currentQueueIndex - 1];
          set({
            currentQueueIndex: currentQueueIndex - 1,
            currentAyahIndex: prevItem.ayahs.length - 1,
            currentTime: 0,
            duration: 0,
            isPlaying: true,
          });
        }
      },

      playPause: () => {
        const { isPlaying } = get();
        set({ isPlaying: !isPlaying });
      },

      setAudioUrl: (url: string | null) => {
        set({ audioUrl: url });
      },

      setCurrentAyahIndex: (index: number) => {
        set({ currentAyahIndex: index, currentTime: 0 });
      },

      setCurrentTime: (time: number) => {
        set({ currentTime: time });
      },

      setDuration: (duration: number) => {
        set({ duration });
      },

      setPlaybackRate: (rate: number) => {
        set({ playbackRate: rate });
      },

      toggleFullScreen: () => {
        const { isFullScreen } = get();
        set({ isFullScreen: !isFullScreen });
      },

      setIsPlaying: (playing: boolean) => {
        set({ isPlaying: playing });
      },

      clearQueue: () => {
        set({
          queue: [],
          currentQueueIndex: 0,
          currentAyahIndex: 0,
          isPlaying: false,
          audioUrl: null,
          currentTime: 0,
          duration: 0,
        });
      },
    }),
    {
      name: "podcast-storage",
      storage: createJSONStorage(() => localForageStorage),
      partialize: (state) => ({
        queue: state.queue,
        currentQueueIndex: state.currentQueueIndex,
        currentAyahIndex: state.currentAyahIndex,
        playbackRate: state.playbackRate,
        reciter: state.reciter,
      }),
    },
  ),
);
