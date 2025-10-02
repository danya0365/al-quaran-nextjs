export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  summary?: string;
  ayahs?: Ayah[];
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  translation?: string;
  audio?: string;
  audioSecondary?: string;
}

export interface AyahInDownloadedAudio extends Ayah {
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
  };
}

export interface AyahInBookmark extends Ayah {
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
  };
  isLastRead?: boolean;
}

export interface Reciter {
  identifier: string;
  name: string;
  language: string;
  englishName: string;
  format: string;
  type: string;
  direction: string;
}

export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: string;
}

export interface Translation {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: string;
}

export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface SurahResponse {
  surahs: Surah[];
}

export interface AyahResponse {
  ayahs: Ayah[];
}

export interface SurahSummary {
  overview: string;
  themes: string[];
  context?: string;
  virtues?: string;
}
