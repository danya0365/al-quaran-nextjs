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

  const [processedTranscriptLength, setProcessedTranscriptLength] = useState(0);

  // The Matching Logic Effect
  useEffect(() => {
    if (!isListening || normalizedWords.length === 0) return;

    const rawTranscript = transcript + " " + interimTranscript;
    const fullSpokenText = normalizeArabicText(rawTranscript);
    
    // Only process the part of the transcript we haven't matched against yet
    // This prevents matching old words against new expected words
    if (fullSpokenText.length <= processedTranscriptLength) return;
    
    const newSpokenText = fullSpokenText.slice(processedTranscriptLength);
    if (newSpokenText.trim().length === 0) return;

    let newMatchCount = matchedWordsCount;
    let newProcessedLength = processedTranscriptLength;

    let progressMade = true;
    // VERY STRICT Lookahead: Only allow skipping 1 maximum word if the API missed it.
    const maxLookAhead = 2; 

    // Helper: Strict fuzzy match.
    const isStrictFuzzyMatch = (expected: string, spokenSegment: string) => {
      if (expected.length <= 2) return spokenSegment.includes(expected);

      const coreExpected = expected.replace(/^[ال]+/g, '');
      if (coreExpected.length < 3) return spokenSegment.includes(coreExpected);
      
      // 1. Exact or Core Match
      if (spokenSegment.includes(expected) || spokenSegment.includes(coreExpected)) {
        return true;
      }
      
      // 2. High consecutive sequence match
      // If the word has 5 letters, we need at least 4 in a row to match.
      const requiredSeqLength = Math.max(3, Math.floor(coreExpected.length * 0.75));
      
      for (let i = 0; i <= coreExpected.length - requiredSeqLength; i++) {
        const seq = coreExpected.substring(i, i + requiredSeqLength);
        if (spokenSegment.includes(seq)) return true;
      }
      
      return false;
    };

    while (progressMade && newMatchCount < normalizedWords.length) {
      progressMade = false;
      
      for (let offset = 0; offset < maxLookAhead; offset++) {
        const checkIdx = newMatchCount + offset;
        if (checkIdx >= normalizedWords.length) break;
        
        const nextExpectedWord = normalizedWords[checkIdx];
        
        if (isStrictFuzzyMatch(nextExpectedWord, newSpokenText)) {
          // Found it! 
          newMatchCount = checkIdx + 1;
          
          // Fast-forward the processed length so we don't re-match these letters
          // We find where this word matched and consume up to that point
          const coreExpected = nextExpectedWord.replace(/^[ال]+/g, '');
          const matchIndex = Math.max(
             newSpokenText.indexOf(nextExpectedWord), 
             newSpokenText.indexOf(coreExpected)
          );
          
          if (matchIndex !== -1) {
             newProcessedLength += matchIndex + coreExpected.length;
          } else {
             newProcessedLength += newSpokenText.length; // If fuzzy matched via sequence, consume all new text
          }
          
          progressMade = true;
          break; 
        }
      }
    }

    if (newMatchCount > matchedWordsCount) {
      setMatchedWordsCount(newMatchCount);
      setProcessedTranscriptLength(newProcessedLength);
      
      if (newMatchCount >= normalizedWords.length) {
        setTimeout(() => {
          advanceToNextAyah();
          setProcessedTranscriptLength(0); // Reset for next Ayah
        }, 800);
      }
    }
  }, [transcript, interimTranscript, isListening, normalizedWords, matchedWordsCount, processedTranscriptLength]);

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
