import axios from "axios";
import {
  ApiResponse,
  Ayah,
  AyahInDownloadedAudio,
  Edition,
  Reciter,
  Surah,
  Translation,
} from "../types/quran";

const API_BASE_URL = "https://api.alquran.cloud/v1";

// Get all editions
export const getAllEditionsFromApi = async (): Promise<Edition[]> => {
  try {
    const response = await axios.get<ApiResponse<Edition[]>>(
      `${API_BASE_URL}/edition`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching editions:", error);
    throw error;
  }
};

// Get all surahs
export const getAllSurahsFromApi = async (
  editionIdentifier: string = "ar.alafasy"
): Promise<Surah[]> => {
  try {
    const response = await axios.get<ApiResponse<{ surahs: Surah[] }>>(
      `${API_BASE_URL}/quran/${editionIdentifier}`,
      {
        // Cache for 1 hour
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    );
    return response.data.data.surahs;
  } catch (error) {
    console.error("Error fetching surahs:", error);
    throw error;
  }
};

export const getArabicSurahFromApi = async (
  surahNumber: number,
  reciterIdentifier: string = "ar.alafasy"
): Promise<Surah> => {
  try {
    console.log(`Fetching arabic surah for surah ${surahNumber} from API`);
    const response = await axios.get<ApiResponse<Surah>>(
      `${API_BASE_URL}/surah/${surahNumber}/${reciterIdentifier}`
    );
    return response.data.data;
  } catch (error) {
    console.error(
      `Error fetching arabic surah for surah ${surahNumber}:`,
      error
    );
    throw error;
  }
};

// Get audio data for a specific surah
export const getAudioForSurahFromApi = async (
  surahNumber: number,
  reciterIdentifier: string = "ar.alafasy"
): Promise<Surah> => {
  try {
    console.log(`Fetching audio for surah ${surahNumber} from API`);
    const response = await axios.get<ApiResponse<Surah>>(
      `${API_BASE_URL}/surah/${surahNumber}/${reciterIdentifier}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching audio for surah ${surahNumber}:`, error);
    throw error;
  }
};

export const getTranslationForSurahFromApi = async (
  surahNumber: number,
  translationIdentifier: string = "ar.alafasy"
): Promise<Surah> => {
  try {
    console.log(`Fetching translation for surah ${surahNumber} from API`);
    const response = await axios.get<ApiResponse<Surah>>(
      `${API_BASE_URL}/surah/${surahNumber}/${translationIdentifier}`
    );
    return response.data.data;
  } catch (error) {
    console.error(
      `Error fetching translation for surah ${surahNumber}:`,
      error
    );
    throw error;
  }
};

// Get available translations
export const getAvailableTranslations = async (): Promise<Translation[]> => {
  try {
    const response = await axios.get<ApiResponse<Translation[]>>(
      `${API_BASE_URL}/edition/type/translation`,
      {
        // Cache for 24 hours (this data rarely changes)
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching translations:", error);
    throw error;
  }
};

// Get available reciters
export const getAvailableReciters = async (): Promise<Reciter[]> => {
  try {
    const response = await axios.get<ApiResponse<Reciter[]>>(
      `${API_BASE_URL}/edition/format/audio`,
      {
        // Cache for 24 hours (this data rarely changes)
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching reciters:", error);
    throw error;
  }
};

// Search for ayahs
export const searchAyahs = async (
  query: string,
  language: string = "en"
): Promise<Ayah[]> => {
  try {
    const response = await axios.get<ApiResponse<{ matches: Ayah[] }>>(
      `${API_BASE_URL}/search/${query}/${language}`
    );
    return response.data.data.matches;
  } catch (error) {
    console.error("Error searching ayahs:", error);
    throw error;
  }
};

// Download audio file
export const downloadAudio = async (
  ayah: AyahInDownloadedAudio
): Promise<string> => {
  try {
    const audioUrl = ayah.audio || ayah.audioSecondary;
    if (!audioUrl) {
      throw new Error("Audio URL not found");
    }

    return audioUrl;
  } catch (error) {
    console.error("Error downloading audio:", error);
    throw error;
  }
};
