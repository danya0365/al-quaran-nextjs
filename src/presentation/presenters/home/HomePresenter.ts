import {
  getAllSurahsFromApi,
  getAvailableReciters,
  getAvailableTranslations,
} from "@/api/api";
import { Reciter, Surah, Translation } from "@/types/quran";

export interface HomeViewModel {
  surahs: Surah[];
  translations: Translation[];
  reciters: Reciter[];
}

/**
 * Presenter for Home page
 * Handles fetching surahs and available editions
 */
export class HomePresenter {
  /**
   * Get view model for the home page
   */
  async getViewModel(): Promise<HomeViewModel> {
    try {
      // Fetch all data in parallel
      // Note: Surahs data is too large for unstable_cache (>2MB)
      // Rely on ISR (revalidate in page.tsx) and fetch cache instead
      const [surahs, translations, reciters] = await Promise.all([
        getAllSurahsFromApi("ar.alafasy"),
        getAvailableTranslations(),
        getAvailableReciters(),
      ]);

      return {
        surahs,
        translations,
        reciters,
      };
    } catch (error) {
      console.error("Error fetching home data:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for the page
   */
  async generateMetadata() {
    return {
      title: "Al-Quran - รายการซูเราะห์",
      description: "อ่านอัลกุรอานทั้ง 114 ซูเราะห์ พร้อมคำแปล และเสียงอ่าน",
    };
  }
}

/**
 * Factory for creating HomePresenter instances
 */
export class HomePresenterFactory {
  static create(): HomePresenter {
    return new HomePresenter();
  }
}
