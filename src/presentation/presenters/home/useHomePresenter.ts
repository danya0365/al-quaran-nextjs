import { useCallback, useEffect, useState } from 'react';
import { HomeViewModel, HomePresenterFactory } from './HomePresenter';
import { useQuranStore } from '@/store/quranStore';

const presenter = HomePresenterFactory.create();

export interface HomePresenterHook {
  viewModel: HomeViewModel | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * Custom hook for Home presenter
 */
export function useHomePresenter(
  initialViewModel: HomeViewModel | null = null
): HomePresenterHook {
  const [viewModel, setViewModel] = useState<HomeViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    surahs: storedSurahs,
    availableTranslations: storedTranslations,
    availableReciters: storedReciters,
    initialized,
    setSurahs, 
    setAvailableTranslations, 
    setAvailableReciters,
    setInitialized 
  } = useQuranStore();

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await presenter.getViewModel();
      setViewModel(data);

      // Store in Zustand
      setSurahs(data.surahs);
      setAvailableTranslations(data.translations);
      setAvailableReciters(data.reciters);
      setInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  }, [setSurahs, setAvailableTranslations, setAvailableReciters, setInitialized]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Load data on mount
  useEffect(() => {
    // Priority 1: Use data from Zustand if initialized
    if (initialized && storedSurahs.length > 0) {
      setViewModel({
        surahs: storedSurahs,
        translations: storedTranslations,
        reciters: storedReciters,
      });
      setLoading(false);
      return;
    }

    // Priority 2: Use initialViewModel if provided
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setSurahs(initialViewModel.surahs);
      setAvailableTranslations(initialViewModel.translations);
      setAvailableReciters(initialViewModel.reciters);
      setInitialized(true);
      setLoading(false);
      return;
    }

    // Priority 3: Fetch fresh data
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    viewModel,
    loading,
    error,
    refreshData,
    searchQuery,
    setSearchQuery,
  };
}
