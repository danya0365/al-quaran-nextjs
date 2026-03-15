"use client";

import { useSurahPresenter } from "@/src/presentation/presenters/surah/useSurahPresenter";
import { useKaraokeLogic } from "./useKaraokeLogic";
import { Amiri } from "next/font/google";
import { useRouter } from "next/navigation";
import SurahSkeletonView from "../SurahSkeletonView";

const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });

interface KaraokeViewProps {
  surahNumber: number;
}

export function KaraokeView({ surahNumber }: KaraokeViewProps) {
  const router = useRouter();
  const { viewModel, loading, error } = useSurahPresenter(surahNumber);

  const {
    isSupported,
    isListening,
    toggleListening,
    speechError,
    activeAyah,
    activeAyahIndex,
    previousAyah,
    nextAyah,
    originalWords,
    matchedWordsCount,
    setMatchedWordsCount,
    advanceToNextAyah,
    goToPreviousAyah,
    transcript,
    interimTranscript,
  } = useKaraokeLogic({ viewModel });

  const handleBack = () => {
    router.back();
  };

  if (loading && !viewModel) {
    return <SurahSkeletonView />;
  }

  if (error && !viewModel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            กลับหน้าก่อนหน้า
          </button>
        </div>
      </div>
    );
  }

  if (!viewModel?.arabicSurah || !activeAyah) {
    return null;
  }

  const surah = viewModel.arabicSurah;

  return (
    <div className="min-h-screen pb-24 bg-[#0a1118] text-gray-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <div className="px-4 py-4 sm:px-6 shadow-sm sticky top-0 z-10 bg-[#0a1118]/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0 w-10 h-10"
            aria-label="กลับ"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="text-center flex-1">
            <h1 className="font-bold text-lg text-emerald-400">
              {surah.englishName}
            </h1>
            <p className="text-xs text-emerald-400/60 font-medium tracking-widest uppercase mt-0.5">
              Karaoke Recitation
            </p>
          </div>
          
          <div className="w-10"></div>
        </div>
      </div>

      {speechError && (
        <div className="bg-red-500/20 text-red-200 p-3 text-center text-sm">
          {speechError}
        </div>
      )}
      {!isSupported && (
        <div className="bg-yellow-500/20 text-yellow-200 p-3 text-center text-sm">
          Your browser does not support Speech Recognition. Try using Chrome or Edge.
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 w-full relative">
          
          {/* Previous Ayah */}
          <div 
            className={`transition-all duration-500 ${previousAyah ? 'opacity-30 transform scale-90 translate-y-0 cursor-pointer hover:opacity-50' : 'opacity-0 transform -translate-y-8 -z-10 absolute left-0 right-0'}`}
            onClick={goToPreviousAyah}
          >
            <p className={`${amiri.className} text-xl md:text-2xl text-gray-400`} dir="rtl">
               {previousAyah?.text}
            </p>
            {previousAyah && (
              <span className="text-xs text-gray-500 block mt-2">
                Ayah {previousAyah.numberInSurah}
              </span>
            )}
          </div>

          {/* Current Ayah */}
          <div className="bg-gradient-to-b from-gray-800/40 to-gray-900/60 rounded-3xl p-6 md:p-12 border border-emerald-900/20 shadow-[0_0_40px_rgba(16,185,129,0.03)] transform transition-all duration-300 relative z-10 w-full">
            <div className={`${amiri.className} text-4xl md:text-5xl lg:text-5xl leading-loose md:leading-loose text-center flex flex-wrap justify-center gap-x-3 md:gap-x-4 gap-y-6`} dir="rtl">
              {originalWords.map((word, idx) => {
                const isMatched = idx < matchedWordsCount;
                const isCurrent = idx === matchedWordsCount;
                
                return (
                  <span
                    key={`${idx}-${word}`}
                    onClick={() => setMatchedWordsCount(idx)} // Allow clicking to skip forward/backward
                    className={`transition-all duration-300 cursor-pointer ${
                      isMatched 
                        ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] font-bold' 
                        : isCurrent && isListening
                          ? 'text-white border-b-2 border-emerald-500/50 pb-1'
                          : 'text-gray-500 hover:text-gray-400'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
              
              <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border border-emerald-900/50 text-emerald-500/50 text-base md:text-lg mx-2 self-center">
                {activeAyah.numberInSurah}
              </span>
            </div>
          </div>

          {/* Next Ayah */}
          <div 
            className={`transition-all duration-500 ${nextAyah ? 'opacity-30 transform scale-90 translate-y-0 cursor-pointer hover:opacity-50' : 'opacity-0 transform translate-y-8 absolute left-0 right-0 -z-10'}`}
            onClick={advanceToNextAyah}
          >
             <p className={`${amiri.className} text-xl md:text-2xl text-gray-400`} dir="rtl">
               {nextAyah?.text}
            </p>
            {nextAyah && (
              <span className="text-xs text-gray-500 block mt-2">
                Ayah {nextAyah.numberInSurah}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pt-6 pb-28 bg-gradient-to-t from-[#0a1118] via-[#0a1118] to-transparent pointer-events-none z-40">
        <div className="max-w-sm mx-auto flex flex-col items-center gap-4 pointer-events-auto">
          
          <span className={`text-sm font-medium transition-colors ${isListening ? 'text-emerald-400' : 'text-gray-500'}`}>
            {isListening ? 'กำลังฟัง...' : 'แตะเพื่อเริ่มอ่าน'}
          </span>
          
          <button 
            onClick={toggleListening}
            disabled={!isSupported}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 text-2xl ${
              isListening 
                ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:bg-emerald-400 animate-pulse' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700'
            } disabled:opacity-50`}
          >
            {isListening ? '⏸️' : '🎤'}
          </button>
        </div>
      </div>
      
      {/* Background glow when listening */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 -z-10 ${
          isListening ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.03) 0%, transparent 70%)'
        }}
      />
    </div>
  );
}
