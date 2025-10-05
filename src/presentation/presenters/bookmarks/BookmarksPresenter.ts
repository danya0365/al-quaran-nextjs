import { AyahInBookmark } from "@/types/quran";

/**
 * View model for bookmarks page
 */
export interface BookmarksViewModel {
  bookmarks: AyahInBookmark[];
  lastRead: AyahInBookmark | null;
  totalBookmarks: number;
}

/**
 * Presenter for Bookmarks page
 * Handles business logic for bookmarks management
 */
export class BookmarksPresenter {
  /**
   * Generate metadata for the page
   */
  generateMetadata() {
    return {
      title: "บุ๊คมาร์ค | Al-Quran",
      description: "อายะห์ที่บันทึกไว้และประวัติการอ่าน",
    };
  }

  /**
   * Prepare view model from bookmarks data
   */
  prepareViewModel(
    bookmarks: AyahInBookmark[],
    lastRead: AyahInBookmark | null
  ): BookmarksViewModel {
    return {
      bookmarks,
      lastRead,
      totalBookmarks: bookmarks.length,
    };
  }
}

/**
 * Factory for creating BookmarksPresenter instances
 */
export class BookmarksPresenterFactory {
  static create(): BookmarksPresenter {
    return new BookmarksPresenter();
  }
}
