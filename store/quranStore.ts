import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Surah, Reciter, Translation, AyahInBookmark } from '@/types/quran';

// Types for store
export type EditionType = 'quran' | 'translation' | 'audio';

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
    (set) => ({
      // Initial state
      surahs: [],
      activeEditions: {
        quran: 'ar.alafasy',
        translation: 'en.sahih',
        audio: 'ar.alafasy',
      },
      availableTranslations: [],
      availableReciters: [],
      bookmarks: [],
      lastRead: null,
      settings: {
        fontSize: 18,
        fontFamily: 'Amiri',
        showTajweed: false,
        showTranslation: true,
      },
      isLoading: false,
      initialized: false,

      // Actions
      setSurahs: (surahs) => set({ surahs }),

      setActiveEdition: (type, identifier) =>
        set((state) => ({
          activeEditions: {
            ...state.activeEditions,
            [type]: identifier,
          },
        })),

      setAvailableTranslations: (translations) =>
        set({ availableTranslations: translations }),

      setAvailableReciters: (reciters) =>
        set({ availableReciters: reciters }),

      addBookmark: (ayah) =>
        set((state) => {
          // Check if already bookmarked
          const exists = state.bookmarks.find(
            (b) => b.number === ayah.number
          );
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
      name: 'quran-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeEditions: state.activeEditions,
        bookmarks: state.bookmarks,
        lastRead: state.lastRead,
        settings: state.settings,
      }),
    }
  )
);
