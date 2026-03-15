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
        
        if (event.error === "not-allowed") {
          setError("Microphone permission denied. Please allow microphone access.");
        } else {
          setError(`Error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Sometimes it stops automatically on silence
        // In a real Karaoke app, you might want to automatically restart it
        // if it was supposed to be continuously listening
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
