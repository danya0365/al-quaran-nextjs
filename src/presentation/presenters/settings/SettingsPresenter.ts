import { Translation, Reciter } from "@/types/quran";
import { QuranSettings, ActiveEditions } from "@/store/quranStore";

/**
 * View model for settings page
 */
export interface SettingsViewModel {
  settings: QuranSettings;
  activeEditions: ActiveEditions;
  availableTranslations: Translation[];
  availableReciters: Reciter[];
  bookmarksCount: number;
  hasLastRead: boolean;
  activeTranslationLabel: string;
  activeReciterLabel: string;
}

/**
 * Presenter for Settings page
 * Handles business logic for settings management
 */
export class SettingsPresenter {
  /**
   * Generate metadata for the page
   */
  generateMetadata() {
    return {
      title: "การตั้งค่า | Al-Quran",
      description: "ปรับแต่งการอ่านอัลกุรอาน",
    };
  }

  /**
   * Prepare view model from settings data
   */
  prepareViewModel(
    settings: QuranSettings,
    activeEditions: ActiveEditions,
    availableTranslations: Translation[],
    availableReciters: Reciter[],
    bookmarksCount: number,
    hasLastRead: boolean
  ): SettingsViewModel {
    const activeTranslationLabel = this.resolveTranslationLabel(
      activeEditions.translation,
      availableTranslations
    );

    const activeReciterLabel = this.resolveReciterLabel(
      activeEditions.audio,
      availableReciters
    );

    return {
      settings,
      activeEditions,
      availableTranslations,
      availableReciters,
      bookmarksCount,
      hasLastRead,
      activeTranslationLabel,
      activeReciterLabel,
    };
  }

  /**
   * Resolve translation label from identifier
   */
  private resolveTranslationLabel(
    identifier: string,
    translations: Translation[]
  ): string {
    const translation = translations.find((t) => t.identifier === identifier);
    if (translation) {
      return `${translation.englishName}${
        translation.language ? ` • ${translation.language}` : ""
      }`;
    }
    return identifier;
  }

  /**
   * Resolve reciter label from identifier
   */
  private resolveReciterLabel(
    identifier: string,
    reciters: Reciter[]
  ): string {
    const reciter = reciters.find((r) => r.identifier === identifier);
    if (reciter) {
      return `${reciter.englishName}${
        reciter.language ? ` • ${reciter.language}` : ""
      }`;
    }
    return identifier;
  }

  /**
   * Filter translations by query
   */
  filterTranslations(
    translations: Translation[],
    query: string
  ): Translation[] {
    const q = query.trim().toLowerCase();
    if (!q) return translations;

    return translations.filter(
      (t) =>
        t.englishName?.toLowerCase().includes(q) ||
        t.language?.toLowerCase().includes(q) ||
        t.identifier?.toLowerCase().includes(q)
    );
  }

  /**
   * Filter reciters by query
   */
  filterReciters(reciters: Reciter[], query: string): Reciter[] {
    const q = query.trim().toLowerCase();
    if (!q) return reciters;

    return reciters.filter(
      (r) =>
        r.englishName?.toLowerCase().includes(q) ||
        r.language?.toLowerCase().includes(q) ||
        r.identifier?.toLowerCase().includes(q)
    );
  }
}

/**
 * Factory for creating SettingsPresenter instances
 */
export class SettingsPresenterFactory {
  static create(): SettingsPresenter {
    return new SettingsPresenter();
  }
}
