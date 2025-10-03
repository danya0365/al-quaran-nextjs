import { useCallback, useEffect, useState } from 'react';
import { SurahViewModel, SurahPresenterFactory } from './SurahPresenter';
import { useQuranStore } from '@/store/quranStore';
import { AyahInBookmark } from '@/types/quran';

const presenter = SurahPresenterFactory.create();

export interface SurahPresenterHook {
  viewModel: SurahViewModel | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  
  // Bookmark actions
  isBookmarked: (ayahNumber: number) => boolean;
  toggleBookmark: (ayahNumber: number) => void;
  
  // Audio player
  currentAyah: number | null;
  setCurrentAyah: (ayahNumber: number | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

/**
 * Custom hook for Surah presenter
 */
export function useSurahPresenter(
  surahNumber: number,
  initialViewModel: SurahViewModel | null = null
): SurahPresenterHook {
  const [viewModel, setViewModel] = useState<SurahViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { 
    activeEditions, 
    bookmarks, 
    addBookmark, 
    removeBookmark,
    setLastRead 
  } = useQuranStore();

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await presenter.getViewModel(
        surahNumber,
        activeEditions.translation,
        activeEditions.audio
      );
      setViewModel(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading surah data:', err);
    } finally {
      setLoading(false);
    }
  }, [surahNumber, activeEditions]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Check if ayah is bookmarked
   */
  const isBookmarked = useCallback(
    (ayahNumber: number) => {
      return bookmarks.some((b) => b.number === ayahNumber);
    },
    [bookmarks]
  );

  /**
   * Toggle bookmark
   */
  const toggleBookmark = useCallback(
    (ayahNumber: number) => {
      if (!viewModel?.arabicSurah) return;

      const ayah = viewModel.arabicSurah.ayahs?.find(
        (a) => a.number === ayahNumber
      );
      if (!ayah) return;

      if (isBookmarked(ayahNumber)) {
        removeBookmark(ayahNumber);
      } else {
        const bookmarkData: AyahInBookmark = {
          ...ayah,
          surah: {
            number: viewModel.arabicSurah.number,
            name: viewModel.arabicSurah.name,
            englishName: viewModel.arabicSurah.englishName,
            englishNameTranslation: viewModel.arabicSurah.englishNameTranslation,
            revelationType: viewModel.arabicSurah.revelationType,
          },
        };
        addBookmark(bookmarkData);
      }
    },
    [viewModel, isBookmarked, addBookmark, removeBookmark]
  );

  // Load data on mount or when dependencies change
  useEffect(() => {
    if (!initialViewModel || 
        activeEditions.translation !== 'en.sahih' || 
        activeEditions.audio !== 'ar.alafasy') {
      loadData();
    }
  }, [initialViewModel, loadData, activeEditions]);

  // Set last read when component mounts
  useEffect(() => {
    if (viewModel?.arabicSurah?.ayahs?.[0]) {
      const firstAyah = viewModel.arabicSurah.ayahs[0];
      const lastReadData: AyahInBookmark = {
        ...firstAyah,
        surah: {
          number: viewModel.arabicSurah.number,
          name: viewModel.arabicSurah.name,
          englishName: viewModel.arabicSurah.englishName,
          englishNameTranslation: viewModel.arabicSurah.englishNameTranslation,
          revelationType: viewModel.arabicSurah.revelationType,
        },
        isLastRead: true,
      };
      setLastRead(lastReadData);
    }
  }, [viewModel, setLastRead]);

  return {
    viewModel,
    loading,
    error,
    refreshData,
    isBookmarked,
    toggleBookmark,
    currentAyah,
    setCurrentAyah,
    isPlaying,
    setIsPlaying,
  };
}
