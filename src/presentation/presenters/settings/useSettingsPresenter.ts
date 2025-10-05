import { useQuranStore } from "@/store/quranStore";
import { useEffect, useMemo, useState } from "react";
import { SettingsPresenter, SettingsViewModel } from "./SettingsPresenter";
import { getAvailableReciters, getAvailableTranslations } from "@/api/api";
import { QuranSettings, EditionType } from "@/store/quranStore";

const presenter = new SettingsPresenter();

export interface SettingsPresenterHook {
  // State
  viewModel: SettingsViewModel;
  loading: boolean;
  error: string | null;

  // Actions
  updateSettings: (settings: Partial<QuranSettings>) => void;
  setActiveEdition: (type: EditionType, identifier: string) => void;
  filterTranslations: (query: string) => ReturnType<typeof presenter.filterTranslations>;
  filterReciters: (query: string) => ReturnType<typeof presenter.filterReciters>;
}

/**
 * Custom hook for Settings presenter
 * Integrates Zustand store with presenter pattern and handles data loading
 */
export function useSettingsPresenter(): SettingsPresenterHook {
  const {
    settings,
    updateSettings,
    activeEditions,
    setActiveEdition,
    availableTranslations,
    availableReciters,
    setAvailableTranslations,
    setAvailableReciters,
    bookmarks,
    lastRead,
  } = useQuranStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available translations and reciters on mount
  useEffect(() => {
    let cancelled = false;

    const loadOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Only load if not already loaded
        if (availableTranslations.length === 0) {
          const translations = await getAvailableTranslations();
          if (!cancelled) {
            setAvailableTranslations(translations);
          }
        }

        if (availableReciters.length === 0) {
          const reciters = await getAvailableReciters();
          if (!cancelled) {
            setAvailableReciters(reciters);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to load settings options";
          setError(errorMessage);
          console.error("Failed to load settings options", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, [
    availableTranslations.length,
    availableReciters.length,
    setAvailableTranslations,
    setAvailableReciters,
  ]);

  // Prepare view model using presenter
  const viewModel = useMemo(
    () =>
      presenter.prepareViewModel(
        settings,
        activeEditions,
        availableTranslations,
        availableReciters,
        bookmarks.length,
        lastRead !== null
      ),
    [
      settings,
      activeEditions,
      availableTranslations,
      availableReciters,
      bookmarks.length,
      lastRead,
    ]
  );

  // Filter functions using presenter
  const filterTranslations = (query: string) =>
    presenter.filterTranslations(availableTranslations, query);

  const filterReciters = (query: string) =>
    presenter.filterReciters(availableReciters, query);

  return {
    viewModel,
    loading,
    error,
    updateSettings,
    setActiveEdition,
    filterTranslations,
    filterReciters,
  };
}
