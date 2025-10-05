import { getAllSurahsFromApi, getAvailableTranslations, getAvailableReciters } from '@/api/api';
import { Surah, Translation, Reciter } from '@/types/quran';
import { unstable_cache } from 'next/cache';

export interface HomeViewModel {
  surahs: Surah[];
  translations: Translation[];
  reciters: Reciter[];
}

/**
 * Cached function to get surahs
 */
const getCachedSurahs = unstable_cache(
  async () => getAllSurahsFromApi('ar.alafasy'),
  ['surahs-list'],
  { 
    revalidate: 3600, // Revalidate every 1 hour
    tags: ['surahs'] 
  }
);

/**
 * Cached function to get translations
 */
const getCachedTranslations = unstable_cache(
  async () => getAvailableTranslations(),
  ['translations-list'],
  { 
    revalidate: 86400, // Revalidate every 24 hours
    tags: ['translations'] 
  }
);

/**
 * Cached function to get reciters
 */
const getCachedReciters = unstable_cache(
  async () => getAvailableReciters(),
  ['reciters-list'],
  { 
    revalidate: 86400, // Revalidate every 24 hours
    tags: ['reciters'] 
  }
);

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
      // Fetch all data in parallel with caching
      const [surahs, translations, reciters] = await Promise.all([
        getCachedSurahs(),
        getCachedTranslations(),
        getCachedReciters(),
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
