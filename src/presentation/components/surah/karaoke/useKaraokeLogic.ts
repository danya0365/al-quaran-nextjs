import { useEffect, useState, useMemo } from "react";
import { useSpeechRecognition } from "@/src/presentation/hooks/useSpeechRecognition";
import { SurahViewModel } from "@/src/presentation/presenters/surah/SurahPresenter";

export function normalizeArabicText(text: string): string {
  if (!text) return "";
  return text
    // Remove diacritics (tashkeel/harakat) and special Quranic symbols
    .replace(
      /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g,
      ""
    )
    // Normalize forms of Alef
    .replace(/[أإآا]/g, "ا")
    // Normalize Teh Marbuta to Heh (speech API might mix them up)
    .replace(/ة/g, "ه")
    // Normalize Yaa / Alif Maksura
    .replace(/[يى]/g, "ي")
    // Normalize symbols like tatweel
    .replace(/ـ/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface UseKaraokeLogicProps {
  viewModel: SurahViewModel | null;
}

export function useKaraokeLogic({ viewModel }: UseKaraokeLogicProps) {
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [matchedWordsCount, setMatchedWordsCount] = useState(0);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
    isSupported,
  } = useSpeechRecognition({ lang: "ar-SA" });

  const ayahs = viewModel?.arabicSurah?.ayahs || [];
  
  // Safe indices
  const activeAyahIndex = Math.min(Math.max(0, currentAyahIndex), Math.max(0, ayahs.length - 1));
  const activeAyah = ayahs[activeAyahIndex];
  
  // Prepare words for current ayah
  const { normalizedWords, originalWords } = useMemo(() => {
    if (!activeAyah?.text) return { normalizedWords: [], originalWords: [] };
    
    // Split by whitespace
    const words = activeAyah.text.split(/\s+/).filter(Boolean);
    const normalizedWords = words.map(normalizeArabicText);
    
    return {
      normalizedWords,
      originalWords: words,
    };
  }, [activeAyah?.text]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const advanceToNextAyah = () => {
    if (activeAyahIndex < ayahs.length - 1) {
      setCurrentAyahIndex((prev) => prev + 1);
      setMatchedWordsCount(0);
      resetTranscript();
    } else {
      // Finished Surah
      stopListening();
    }
  };

  const goToPreviousAyah = () => {
    if (activeAyahIndex > 0) {
      setCurrentAyahIndex((prev) => prev - 1);
      setMatchedWordsCount(0);
      resetTranscript();
    }
  };

  // The Matching Logic Effect
  useEffect(() => {
    if (!isListening || normalizedWords.length === 0) return;

    const rawTranscript = transcript + " " + interimTranscript;
    const fullSpokenText = normalizeArabicText(rawTranscript);
    
    if (fullSpokenText.length === 0) return;

    let newMatchCount = matchedWordsCount;

    // Get the last N characters to avoid matching words from way behind
    const recentSpoken = fullSpokenText.slice(-60);

    let progressMade = true;
    const maxLookAhead = 4; // Look further ahead in case API skipped multiple words

    // Helper: Super basic fuzzy match for Arabic words
    // Checks if the key characters of the expected word exist in the spoken text segment
    const isFuzzyMatch = (expected: string, spokenText: string) => {
      // Very short words like "wa" (و) or "bi" (ب) are hard. We just assume they pass if they are part of a lookahead
      // or we just skip them easily if the subsequent word matches.
      if (expected.length <= 2) return true;

      // Extract core characters (ignore common prefixes/suffixes that might distort)
      // Remove Alif, Lam at the start if present
      const coreExpected = expected.replace(/^[ال]+/g, '');
      if (coreExpected.length < 3) return spokenText.includes(coreExpected);

      // We just check if the spoken text contains a chunk that is very similar.
      // Often, Google returns e.g. "عالمين" instead of "العالمين", or "الرحمن" instead of "الرحمان"
      
      // 1. Direct includes fallback
      if (spokenText.includes(coreExpected)) return true;
      
      // 2. Contains 3 consecutive characters anywhere
      for (let i = 0; i <= coreExpected.length - 3; i++) {
        const trigram = coreExpected.substring(i, i + 3);
        if (spokenText.includes(trigram)) return true;
      }
      
      // 3. Fallback: Check if we have at least 70% of the characters in order
      let expectedIdx = 0;
      let matchedChars = 0;
      for (let i = 0; i < spokenText.length && expectedIdx < expected.length; i++) {
        if (spokenText[i] === expected[expectedIdx]) {
          matchedChars++;
          expectedIdx++;
        } else if (spokenText[i] === ' ' || spokenText[i] === 'ا') {
           // allow spaces or extra alifs in spoken text to be skipped
        } else {
           // if mismatch, let's try skipping one char in expected
           expectedIdx++; 
        }
      }
      
      return (matchedChars / expected.length) >= 0.6; // 60% char match
    };

    while (progressMade && newMatchCount < normalizedWords.length) {
      progressMade = false;
      
      for (let offset = 0; offset < maxLookAhead; offset++) {
        const checkIdx = newMatchCount + offset;
        if (checkIdx >= normalizedWords.length) break;
        
        const nextExpectedWord = normalizedWords[checkIdx];
        
        if (isFuzzyMatch(nextExpectedWord, recentSpoken)) {
          // Found it! Jump the counter to this word
          // If we looked ahead (offset > 0), this means we just skipped the intermediate words
          newMatchCount = checkIdx + 1;
          progressMade = true;
          break; 
        }
      }
    }

    if (newMatchCount > matchedWordsCount) {
      setMatchedWordsCount(newMatchCount);
      
      if (newMatchCount >= normalizedWords.length) {
        setTimeout(() => {
          advanceToNextAyah();
        }, 800);
      }
    }
  }, [transcript, interimTranscript, isListening, normalizedWords, matchedWordsCount]);

  return {
    isSupported,
    isListening,
    toggleListening,
    speechError,
    
    activeAyah,
    activeAyahIndex,
    previousAyah: activeAyahIndex > 0 ? ayahs[activeAyahIndex - 1] : null,
    nextAyah: activeAyahIndex < ayahs.length - 1 ? ayahs[activeAyahIndex + 1] : null,
    
    originalWords,
    matchedWordsCount,
    setMatchedWordsCount, // expose to allow manual skipping if needed
    
    advanceToNextAyah,
    goToPreviousAyah,
    transcript,
    interimTranscript,
  };
}
