import { getAllSurahsFromApi, getAvailableTranslations, getAvailableReciters } from '@/api/api';
import { Surah, Translation, Reciter } from '@/types/quran';

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
      const [surahs, translations, reciters] = await Promise.all([
        getAllSurahsFromApi('ar.alafasy'),
        getAvailableTranslations(),
        getAvailableReciters(),
      ]);

      return {
        surahs,
        translations,
        reciters,
      };
    } catch (error) {
      console.error('Error fetching home data:', error);
      throw error;
    }
  }

  /**
   * Generate metadata for the page
   */
  async generateMetadata() {
    return {
      title: 'Al-Quran - รายการซูเราะห์',
      description: 'อ่านอัลกุรอานทั้ง 114 ซูเราะห์ พร้อมคำแปล และเสียงอ่าน',
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
