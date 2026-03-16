import { create } from "zustand";
import { persist } from "zustand/middleware";

interface KaraokeState {
  activeSurahNumber: number | null;
  currentAyahIndex: number;
  matchedWordsCount: number;
  
  // Actions
  initializeSurah: (surahNumber: number) => void;
  setCurrentAyahIndex: (index: number) => void;
  setMatchedWordsCount: (count: number) => void;
  resetProgress: () => void;
}

export const useKaraokeStore = create<KaraokeState>()(
  persist(
    (set, get) => ({
      activeSurahNumber: null,
      currentAyahIndex: 0,
      matchedWordsCount: 0,

      initializeSurah: (surahNumber: number) => {
        const currentActiveSurah = get().activeSurahNumber;
        // If it's a new Surah, we reset the progress
        if (currentActiveSurah !== surahNumber) {
          set({
            activeSurahNumber: surahNumber,
            currentAyahIndex: 0,
            matchedWordsCount: 0,
          });
        }
      },

      setCurrentAyahIndex: (index: number) => {
        set({ currentAyahIndex: index });
      },

      setMatchedWordsCount: (count: number) => {
        set({ matchedWordsCount: count });
      },

      resetProgress: () => {
        set({
          currentAyahIndex: 0,
          matchedWordsCount: 0,
        });
      },
    }),
    {
      name: "quran-karaoke-storage", // keys for localStorage
    }
  )
);
