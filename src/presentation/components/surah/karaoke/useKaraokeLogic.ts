import { useEffect, useState, useMemo, useRef } from "react";
import { useSpeechRecognition } from "@/src/presentation/hooks/useSpeechRecognition";
import { SurahViewModel } from "@/src/presentation/presenters/surah/SurahPresenter";
import { useKaraokeStore } from "./useKaraokeStore";

export function normalizeArabicText(text: string): string {
  if (!text) return "";
  return text
    // Remove ALL diacritics (tashkeel/harakat) and special Quranic symbols
    .replace(
      /[\u0600-\u061B\u064B-\u065F\u0670\u06D6-\u06ED\u08D4-\u08E1]/g,
      ""
    )
    // Normalize forms of Alef, including Alif Waslah (ٱ)
    .replace(/[أإآٱا]/g, "ا")
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
  const { currentAyahIndex, setCurrentAyahIndex, matchedWordsCount, setMatchedWordsCount, initializeSurah } = useKaraokeStore();
  const [lastMatchTime, setLastMatchTime] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize store state when Surah mounts
  useEffect(() => {
    if (viewModel?.arabicSurah?.number) {
      initializeSurah(viewModel.arabicSurah.number);
      setIsInitialized(true);
    }
  }, [viewModel?.arabicSurah?.number, initializeSurah]);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
    isSupported,
    isReconnecting,
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
      setCurrentAyahIndex(currentAyahIndex + 1);
    } else {
      // Finished Surah
      stopListening();
    }
  };

  const goToPreviousAyah = () => {
    if (activeAyahIndex > 0) {
      setCurrentAyahIndex(currentAyahIndex - 1);
    }
  };

  const [processedTranscriptLength, setProcessedTranscriptLength] = useState(0);

  // Keep refs of the latest transcripts to use in the Ayah change effect
  // without adding them to the dependency array (which would cause infinite loops)
  const transcriptRef = useRef("");
  const interimTranscriptRef = useRef("");
  useEffect(() => {
    transcriptRef.current = transcript;
    interimTranscriptRef.current = interimTranscript;
  }, [transcript, interimTranscript]);

  // Use a ref to prevent double-firing advanceToNextAyah during the 800ms delay
  const isAdvancingRef = useRef(false);

  // Sync state when active ayah changes manually (Prev/Next buttons or URL)
  // or automatically.
  useEffect(() => {
    setMatchedWordsCount(0);
    isAdvancingRef.current = false;
    
    // Crucial fix: When we move to a new Ayah, we MUST consider all text heard UP TO THIS POINT
    // as "old text", so it doesn't accidentally trigger matches on the new Ayah.
    const rawTranscript = transcriptRef.current + " " + interimTranscriptRef.current;
    const fullSpokenText = normalizeArabicText(rawTranscript);
    
    setProcessedTranscriptLength(fullSpokenText.length);
    setLastMatchTime(Date.now()); // Reset match throttle
  }, [activeAyahIndex, setMatchedWordsCount]);

  // The Matching Logic Effect
  useEffect(() => {
    if (!isInitialized || !isListening || normalizedWords.length === 0) return;
    
    // Throttle matches to prevent rapid skipping (min 300ms between words)
    if (Date.now() - lastMatchTime < 300) return;

    const rawTranscript = transcript + " " + interimTranscript;
    const fullSpokenText = normalizeArabicText(rawTranscript);
    
    // Only process the part of the transcript we haven't matched against yet
    // This prevents matching old words against new expected words
    if (fullSpokenText.length <= processedTranscriptLength) return;
    
    // Double check that we are actually looking at new words
    const currentSpokenText = fullSpokenText.slice(processedTranscriptLength);
    if (currentSpokenText.trim().length === 0) return;

    let newMatchCount = matchedWordsCount;
    let newProcessedLength = processedTranscriptLength;

    let progressMade = true;
    // VERY STRICT Lookahead: Only allow skipping 1 maximum word if the API missed it.
    const maxLookAhead = 2; 

    // Helper: Strict fuzzy match.
    const isStrictFuzzyMatch = (expected: string, spokenSegment: string) => {
      // Clean up elongated letters from speaking Tadweed (e.g. مننن -> من, اهههه -> اه)
      // Removes consecutive identical characters in the spoken segment
      const normalizedSpoken = spokenSegment.replace(/(.)\1+/g, '$1$1');
      
      if (expected.length <= 2) {
        return normalizedSpoken.includes(expected) || spokenSegment.includes(expected);
      }

      const coreExpected = expected.replace(/^[ال]+/g, '');
      if (coreExpected.length < 3) {
        return normalizedSpoken.includes(coreExpected) || spokenSegment.includes(coreExpected);
      }
      
      // 1. Exact or Core Match
      if (spokenSegment.includes(expected) || spokenSegment.includes(coreExpected)) {
        return true;
      }
      
      // 2. High consecutive sequence match
      // If the word has 5 letters, we allow matching if ~60% of the word matches in sequence.
      const requiredSeqLength = Math.max(3, Math.floor(coreExpected.length * 0.6));
      
      for (let i = 0; i <= coreExpected.length - requiredSeqLength; i++) {
        const seq = coreExpected.substring(i, i + requiredSeqLength);
        if (spokenSegment.includes(seq)) return true;
      }

      // 3. Fallback: Check if the spoken segments contains most characters in order (Subsequence)
      // Useful when speech API drops a middle letter (e.g. نَسْتَعِينُ hearing نستعين but returning نستين )
      // ONLY apply this if the expected word is reasonably long (4+ chars) to prevent short word false positives.
      if (coreExpected.length >= 4) {
        let matchIdx = 0;
        let matchedChars = 0;
        for (let i = 0; i < coreExpected.length; i++) {
          const charIdx = spokenSegment.indexOf(coreExpected[i], matchIdx);
          if (charIdx !== -1) {
            matchedChars++;
            matchIdx = charIdx + 1; // move forward
          }
        }
        return matchedChars >= requiredSeqLength;
      }
      
      return false;
    };

    while (progressMade && newMatchCount < normalizedWords.length) {
      progressMade = false;
      
      // Update the spoken text to only include what we haven't processed yet
      const currentLoopSpokenText = fullSpokenText.slice(newProcessedLength);
      if (currentLoopSpokenText.trim().length === 0) break;

      for (let offset = 0; offset < maxLookAhead; offset++) {
        const checkIdx = newMatchCount + offset;
        if (checkIdx >= normalizedWords.length) break;
        
        const nextExpectedWord = normalizedWords[checkIdx];
        
        if (isStrictFuzzyMatch(nextExpectedWord, currentLoopSpokenText)) {
          // Found it! 
          newMatchCount = checkIdx + 1;
          
          // Fast-forward the processed length so we don't re-match these letters
          // We find where this word matched and consume up to that point
          const coreExpected = nextExpectedWord.replace(/^[ال]+/g, '');
          const matchIndex = Math.max(
             currentLoopSpokenText.indexOf(nextExpectedWord), 
             currentLoopSpokenText.indexOf(coreExpected)
          );
          
          if (matchIndex !== -1) {
             newProcessedLength += matchIndex + coreExpected.length;
          } else {
             newProcessedLength += currentLoopSpokenText.length; // If fuzzy matched via sequence, consume all new text
          }
          
          progressMade = true;
          break; 
        }
      }
    }

    if (newMatchCount > matchedWordsCount) {
      setMatchedWordsCount(newMatchCount);
      setProcessedTranscriptLength(newProcessedLength);
      setLastMatchTime(Date.now());
      
      if (newMatchCount >= normalizedWords.length && !isAdvancingRef.current) {
        isAdvancingRef.current = true;
        setTimeout(() => {
          advanceToNextAyah();
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
    isReconnecting,
  };
}
