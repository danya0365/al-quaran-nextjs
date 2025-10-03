import { 
  getArabicSurahFromApi, 
  getTranslationForSurahFromApi,
  getAudioForSurahFromApi 
} from '@/api/api';
import { Surah } from '@/types/quran';

export interface SurahViewModel {
  arabicSurah: Surah;
  translationSurah: Surah | null;
  audioSurah: Surah | null;
}

/**
 * Presenter for Surah detail page
 * Handles fetching surah data with translation and audio
 */
export class SurahPresenter {
  /**
   * Get view model for the surah page
   */
  async getViewModel(
    surahNumber: number,
    translationId: string = 'en.sahih',
    audioId: string = 'ar.alafasy'
  ): Promise<SurahViewModel> {
    try {
      // Fetch all data in parallel
      const [arabicSurah, translationSurah, audioSurah] = await Promise.all([
        getArabicSurahFromApi(surahNumber, 'ar.alafasy'),
        getTranslationForSurahFromApi(surahNumber, translationId).catch(() => null),
        getAudioForSurahFromApi(surahNumber, audioId).catch(() => null),
      ]);

      return {
        arabicSurah,
        translationSurah,
        audioSurah,
      };
    } catch (error) {
      console.error('Error fetching surah data:', error);
      throw error;
    }
  }

  /**
   * Generate metadata for the page
   */
  async generateMetadata(surahNumber: number) {
    try {
      const surah = await getArabicSurahFromApi(surahNumber);
      return {
        title: `${surah.englishName} (${surah.name}) - Al-Quran`,
        description: `อ่าน ${surah.englishName} (${surah.englishNameTranslation}) - ซูเราะห์ที่ ${surah.number} ประกอบด้วย ${surah.ayahs?.length || 0} อายะห์`,
      };
    } catch {
      return {
        title: 'Al-Quran',
        description: 'อ่านอัลกุรอาน',
      };
    }
  }
}

/**
 * Factory for creating SurahPresenter instances
 */
export class SurahPresenterFactory {
  static create(): SurahPresenter {
    return new SurahPresenter();
  }
}
