import { useCallback, useEffect, useRef, useState } from "react";

// Add global declarations for SpeechRecognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface UseSpeechRecognitionResult {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

export function useSpeechRecognition({
  lang = "ar-SA",
}: { lang?: string } = {}): UseSpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const isListeningRequestedRef = useRef(false);
  const isSupported = typeof window !== "undefined" && (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);

  useEffect(() => {
    if (typeof window !== "undefined" && isSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        let currentInterimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            currentTranscript += result[0].transcript + " ";
          } else {
            currentInterimTranscript += result[0].transcript;
          }
        }

        setTranscript((prev) => prev + currentTranscript);
        setInterimTranscript(currentInterimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        
        if (event.error === "not-allowed" || event.error === "audio-capture") {
          setError("Microphone permission denied or not found. Please check your mic settings.");
          isListeningRequestedRef.current = false; // Fatal error, stop trying to reconnect
        } else if (event.error === "network") {
          // Network errors are common in Web Speech API. Don't show hard error to user.
          console.warn("Network error encountered. Will attempt to reconnect...");
        } else if (event.error === "no-speech") {
          // Just silence timeout. Ignore.
        } else if (event.error !== "aborted") {
          setError(`Error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Automatic reconnect logic
        if (isListeningRequestedRef.current) {
          console.log("Speech recognition ended unexpectedly. Auto-restarting...");
          setTimeout(() => {
            if (isListeningRequestedRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e: any) {
                if (e.name !== "InvalidStateError") {
                  console.error("Failed to auto-restart speech recognition:", e);
                }
              }
            }
          }, 300);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [lang, isSupported]);

  const startListening = useCallback(() => {
    setError(null);
    isListeningRequestedRef.current = true;
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e: any) {
      if (e.name === "InvalidStateError") {
         // Already started
      } else {
        console.error("Failed to start speech recognition:", e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    isListeningRequestedRef.current = false;
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error("Failed to stop speech recognition:", e);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  };
}
