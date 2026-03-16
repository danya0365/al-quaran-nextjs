import { ActiveEditions, QuranSettings } from "@/store/quranStore";
import { Reciter, Translation } from "@/types/quran";

// List of popular, high-quality Qaris to filter the raw API response
const CURATED_RECITERS = [
  "ar.alafasy",           // Mishary Rashid Alafasy
  "ar.abdulbasitmurattal",// AbdulBaset AbdulSamad
  "ar.abdullahbasfar",    // Abdullah Basfar
  "ar.abdurrahmaansudais",// Abdur-Rahman as-Sudais
  "ar.mahermuaiqly",      // Maher Al Muaiqly
  "ar.minshawi",          // Minshawi
  "ar.muhammadayyoub",    // Muhammad Ayyoub
  "ar.saoodshuraym",      // Saood bin Ibraaheem Ash-Shuraym
  "ar.husary",            // Mahmoud Khalil Al-Husary
  "ar.hudhaify",          // Ali Alhuthaifi
];

// List of recommended translations prioritizing Thai and major English editions
const CURATED_TRANSLATIONS = [
  "th.thai",          // Thai Translation
  "en.sahih",         // Saheeh International (English)
  "en.yusufali",      // Yusuf Ali (English)
  "en.pickthall",     // Marmaduke Pickthall (English)
  "en.asad",          // Muhammad Asad (English)
  "id.indonesian",    // Indonesian
  "ms.basmeih",       // Malay
];

// Mapping language codes to readable Thai names
export const LANGUAGE_MAP: Record<string, string> = {
  th: "ภาษาไทย",
  en: "ภาษาอังกฤษ",
  ar: "ภาษาอาหรับ",
  id: "ภาษาอินโดนีเซีย",
  ms: "ภาษามลายู",
  ur: "ภาษาอูรดู",
  fr: "ภาษาฝรั่งเศส",
  ru: "ภาษารัสเซีย",
  zh: "ภาษาจีน",
  bn: "ภาษาเบงกาลี",
  bs: "ภาษาบอสเนีย",
  de: "ภาษาเยอรมัน",
  es: "ภาษาสเปน",
  fa: "ภาษาเปอร์เซีย",
  ha: "ภาษาเฮาซา",
  hi: "ภาษาฮินดี",
  it: "ภาษาอิตาลี",
  ja: "ภาษาญี่ปุ่น",
  ko: "ภาษาเกาหลี",
  ku: "ภาษาเคิร์ด",
  nl: "ภาษาดัตช์",
  pt: "ภาษาโปรตุเกส",
  ro: "ภาษาโรมาเนีย",
  sd: "ภาษาสินธ์",
  so: "ภาษาโซมาลี",
  sq: "ภาษาแอลเบเนีย",
  sv: "ภาษาสวีเดน",
  sw: "ภาษาสวาฮีลี",
  ta: "ภาษาทมิฬ",
  tg: "ภาษาทาจิก",
  tr: "ภาษาตุรกี",
  tt: "ภาษาตาตาร์",
  ug: "ภาษาอุยกูร์",
  uz: "ภาษาอุซเบก",
  "am": "ภาษาอัมฮาริก",
  "az": "ภาษาอาเซอร์ไบจาน",
  "bg": "ภาษาบัลแกเรีย",
  "cs": "ภาษาเช็ก",
  "dv": "ภาษามัลดีฟส์",
  "ml": "ภาษามาลายาลัม",
  "no": "ภาษานอร์เวย์",
  "pl": "ภาษาโปแลนด์",
  "ps": "ภาษาพัชโต",
  "si": "ภาษาสิงหล",
};

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
      const langName = translation.language 
        ? LANGUAGE_MAP[translation.language] || translation.language.toUpperCase() 
        : "";
      return langName ? `${langName} แปลโดย ${translation.englishName}` : translation.englishName;
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
      const langName = reciter.language 
        ? LANGUAGE_MAP[reciter.language] || reciter.language.toUpperCase() 
        : "";
      return langName ? `${langName} เสียงอ่านโดย ${reciter.englishName}` : reciter.englishName;
    }
    return identifier;
  }

  /**
   * Filter translations by query, prioritizing a curated list
   */
  filterTranslations(
    translations: Translation[],
    query: string
  ): Translation[] {
    // Only keep translations that are in our curated list
    const filteredByCurated = translations.filter((t) =>
      CURATED_TRANSLATIONS.includes(t.identifier)
    );

    const q = query.trim().toLowerCase();
    
    // If no query, return the curated list
    if (!q) {
      return filteredByCurated.length > 0 ? filteredByCurated : translations;
    }

    // Filter curated list based on the query
    const results = filteredByCurated.filter(
      (t) => {
        const mappedLang = t.language ? (LANGUAGE_MAP[t.language] || t.language).toLowerCase() : "";
        return t.englishName?.toLowerCase().includes(q) ||
               t.language?.toLowerCase().includes(q) ||
               mappedLang.includes(q) ||
               t.identifier?.toLowerCase().includes(q);
      }
    );
    
    // Fallback search to the entire API list if no curated results match
    if (results.length === 0) {
      return translations.filter(
        (t) => {
          const mappedLang = t.language ? (LANGUAGE_MAP[t.language] || t.language).toLowerCase() : "";
          return t.englishName?.toLowerCase().includes(q) ||
                 t.language?.toLowerCase().includes(q) ||
                 mappedLang.includes(q) ||
                 t.identifier?.toLowerCase().includes(q);
        }
      );
    }

    return results;
  }

  /**
   * Filter reciters by query, prioritizing a curated list of popular Qaris
   */
  filterReciters(reciters: Reciter[], query: string): Reciter[] {
    // Only keep reciters that are in our curated list
    const filteredByCurated = reciters.filter((r) =>
      CURATED_RECITERS.includes(r.identifier)
    );

    const q = query.trim().toLowerCase();
    
    // If no query, return the curated list (or fallback to original if curated is empty)
    if (!q) {
      return filteredByCurated.length > 0 ? filteredByCurated : reciters;
    }

    // Filter the curated list based on the search query
    const results = filteredByCurated.filter(
      (r) => {
        const mappedLang = r.language ? (LANGUAGE_MAP[r.language] || r.language).toLowerCase() : "";
        return r.englishName?.toLowerCase().includes(q) ||
               r.language?.toLowerCase().includes(q) ||
               mappedLang.includes(q) ||
               r.identifier?.toLowerCase().includes(q);
      }
    );
    
    // Fallback: If query yields no results from curated list, search the whole API list
    if (results.length === 0) {
      return reciters.filter(
        (r) => {
          const mappedLang = r.language ? (LANGUAGE_MAP[r.language] || r.language).toLowerCase() : "";
          return r.englishName?.toLowerCase().includes(q) ||
                 r.language?.toLowerCase().includes(q) ||
                 mappedLang.includes(q) ||
                 r.identifier?.toLowerCase().includes(q);
        }
      );
    }
    
    return results;
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
