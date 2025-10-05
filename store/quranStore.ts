import { AyahInBookmark, Reciter, Surah, Translation } from "@/types/quran";
import localforage from "localforage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SurahViewModel } from "@/src/presentation/presenters/surah/SurahPresenter";

// Initialize localforage instance
localforage.config({
  name: "al-quaran",
  storeName: "quran",
});

// Types for store
export type EditionType = "quran" | "translation" | "audio";

export interface ActiveEditions {
  quran: string;
  translation: string;
  audio: string;
}

export interface QuranSettings {
  fontSize: number;
  fontFamily: string;
  showTajweed: boolean;
  showTranslation: boolean;
}

interface QuranState {
  // Surahs data
  surahs: Surah[];
  setSurahs: (surahs: Surah[]) => void;

  // Surah cache (for detail pages)
  surahCache: Record<string, SurahViewModel>;
  setSurahCache: (key: string, data: SurahViewModel) => void;
  getSurahFromCache: (surahNumber: number, translationId: string, audioId: string) => SurahViewModel | null;

  // Active editions
  activeEditions: ActiveEditions;
  setActiveEdition: (type: EditionType, identifier: string) => void;

  // Available editions
  availableTranslations: Translation[];
  setAvailableTranslations: (translations: Translation[]) => void;

  availableReciters: Reciter[];
  setAvailableReciters: (reciters: Reciter[]) => void;

  // Bookmarks and Last Read
  bookmarks: AyahInBookmark[];
  addBookmark: (ayah: AyahInBookmark) => void;
  removeBookmark: (ayahNumber: number) => void;

  lastRead: AyahInBookmark | null;
  setLastRead: (ayah: AyahInBookmark) => void;

  // Settings
  settings: QuranSettings;
  updateSettings: (settings: Partial<QuranSettings>) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Initialize
  initialized: boolean;
  setInitialized: (init: boolean) => void;
}

export const useQuranStore = create<QuranState>()(
  persist(
    (set, get) => ({
      // Initial state
      surahs: [],
      surahCache: {},
      activeEditions: {
        quran: "ar.alafasy",
        translation: "en.sahih",
        audio: "ar.alafasy",
      },
      availableTranslations: [],
      availableReciters: [],
      bookmarks: [],
      lastRead: null,
      settings: {
        fontSize: 18,
        fontFamily: "Amiri",
        showTajweed: false,
        showTranslation: true,
      },
      isLoading: false,
      initialized: false,

      // Actions
      setSurahs: (surahs) => set({ surahs }),

      setSurahCache: (key, data) =>
        set((state) => ({
          surahCache: {
            ...state.surahCache,
            [key]: data,
          },
        })),

      getSurahFromCache: (surahNumber, translationId, audioId) => {
        const key = `${surahNumber}-${translationId}-${audioId}`;
        return get().surahCache[key] || null;
      },

      setActiveEdition: (type, identifier) =>
        set((state) => ({
          activeEditions: {
            ...state.activeEditions,
            [type]: identifier,
          },
        })),

      setAvailableTranslations: (translations) =>
        set({ availableTranslations: translations }),

      setAvailableReciters: (reciters) => set({ availableReciters: reciters }),

      addBookmark: (ayah) =>
        set((state) => {
          // Check if already bookmarked
          const exists = state.bookmarks.find((b) => b.number === ayah.number);
          if (exists) return state;

          return {
            bookmarks: [...state.bookmarks, ayah],
          };
        }),

      removeBookmark: (ayahNumber) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.number !== ayahNumber),
        })),

      setLastRead: (ayah) => set({ lastRead: ayah }),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        })),

      setIsLoading: (loading) => set({ isLoading: loading }),

      setInitialized: (init) => set({ initialized: init }),
    }),
    {
      name: "quran-storage",
      storage: createJSONStorage(() => localforage),
    }
  )
);
