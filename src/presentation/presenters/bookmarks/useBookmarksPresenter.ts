import { useQuranStore } from "@/store/quranStore";
import { useMemo } from "react";
import { BookmarksPresenter, BookmarksViewModel } from "./BookmarksPresenter";

const presenter = new BookmarksPresenter();

export interface BookmarksPresenterHook {
  // State
  viewModel: BookmarksViewModel;
  loading: boolean;

  // Actions
  removeBookmark: (ayahNumber: number) => void;
}

/**
 * Custom hook for Bookmarks presenter
 * Integrates Zustand store with presenter pattern
 */
export function useBookmarksPresenter(): BookmarksPresenterHook {
  const { bookmarks, lastRead, removeBookmark } = useQuranStore();

  // Prepare view model using presenter
  const viewModel = useMemo(
    () => presenter.prepareViewModel(bookmarks, lastRead),
    [bookmarks, lastRead]
  );

  return {
    viewModel,
    loading: false,
    removeBookmark,
  };
}
