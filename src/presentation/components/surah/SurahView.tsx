"use client";

import { SurahViewModel } from "@/src/presentation/presenters/surah/SurahPresenter";
import { useSurahPresenter } from "@/src/presentation/presenters/surah/useSurahPresenter";
import { useQuranStore } from "@/store/quranStore";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Amiri, Lateef, Scheherazade_New } from "next/font/google";
// Arabic fonts must be initialized at module scope
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });
const lateef = Lateef({ subsets: ["arabic"], weight: ["400"] });
const scheherazade = Scheherazade_New({ subsets: ["arabic"], weight: ["400", "700"] });
import TajweedText from "./TajweedText";

interface SurahViewProps {
  surahNumber: number;
  initialViewModel?: SurahViewModel;
}

export function SurahView({ surahNumber, initialViewModel }: SurahViewProps) {
  const {
    viewModel,
    loading,
    error,
    isBookmarked,
    toggleBookmark,
    currentAyah,
    setCurrentAyah,
    isPlaying,
    setIsPlaying,
  } = useSurahPresenter(surahNumber, initialViewModel);

  const { settings, updateSettings } = useQuranStore();
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const arabicFontClass =
    settings.fontFamily === "Lateef"
      ? lateef.className
      : settings.fontFamily === "ScheherazadeNew"
      ? scheherazade.className
      : amiri.className;

  // Play audio when currentAyah changes
  useEffect(() => {
    if (currentAyah && audioRef.current && viewModel?.audioSurah) {
      const ayah = viewModel.audioSurah.ayahs?.find(
        (a) => a.number === currentAyah
      );
      if (ayah?.audio) {
        audioRef.current.src = ayah.audio;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [currentAyah, viewModel, setIsPlaying]);

  if (loading && !viewModel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-kanit">กำลังโหลดซูเราะห์...</p>
        </div>
      </div>
    );
  }

  if (error && !viewModel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-kanit">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-gray-600 mb-4 font-kanit">{error}</p>
          <Link
            href="/"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-kanit"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }

  if (!viewModel?.arabicSurah) {
    return null;
  }

  const surah = viewModel.arabicSurah;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 pt-8 pb-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/home"
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg
                className="w-6 h-6"
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
            </Link>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ⚙️
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold font-kanit mb-1">
              {surah.englishName}
            </h1>
            <p className="text-3xl mb-2" dir="rtl">
              {surah.name}
            </p>
            <p className="text-emerald-100 text-sm font-kanit">
              {surah.englishNameTranslation} • {surah.ayahs?.length || 0} อายะห์
              •{surah.revelationType === "Meccan" ? " มักกะห์" : " มะดีนะห์"}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-800 font-kanit">การตั้งค่า</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200"
                aria-label="close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              {/* Font Size */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-kanit">ขนาดตัวอักษร</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateSettings({ fontSize: Math.max(14, settings.fontSize - 2) })
                    }
                    className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-sm font-kanit">
                    {settings.fontSize}
                  </span>
                  <button
                    onClick={() =>
                      updateSettings({ fontSize: Math.min(32, settings.fontSize + 2) })
                    }
                    className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Arabic Font Family */}
              <div>
                <div className="text-sm text-gray-600 mb-2 font-kanit">ฟอนต์ภาษาอาหรับ</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "Amiri", label: "Amiri", className: amiri.className },
                    { key: "Lateef", label: "Lateef", className: lateef.className },
                    { key: "ScheherazadeNew", label: "Scheherazade", className: scheherazade.className },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => updateSettings({ fontFamily: f.key })}
                      className={`p-3 rounded-lg border text-center ${
                        settings.fontFamily === f.key
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      } ${f.className}`}
                    >
                      بِسْمِ اللَّهِ
                    </button>
                  ))}
                </div>
              </div>

              {/* Show Translation */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-kanit">แสดงคำแปล</span>
                <button
                  onClick={() => updateSettings({ showTranslation: !settings.showTranslation })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showTranslation ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.showTranslation ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Show Tajweed */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-kanit">แสดงทัจญ์วีด</span>
                <button
                  onClick={() => updateSettings({ showTajweed: !settings.showTajweed })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showTajweed ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.showTajweed ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bismillah */}
      {surah.number !== 1 && surah.number !== 9 && (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center text-3xl text-gray-700" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </div>
      )}

      {/* Ayahs */}
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        {surah.ayahs?.map((ayah) => {
          const translationAyah = viewModel.translationSurah?.ayahs?.find(
            (a) => a.numberInSurah === ayah.numberInSurah
          );
          const audioAyah = viewModel.audioSurah?.ayahs?.find(
            (a) => a.numberInSurah === ayah.numberInSurah
          );

          return (
            <div
              key={ayah.number}
              className={`bg-white rounded-2xl shadow-sm p-6 border border-gray-100 ${
                currentAyah === ayah.number ? "ring-2 ring-emerald-500" : ""
              }`}
            >
              {/* Arabic Text */}
              <div
                className={`text-right mb-4 leading-loose ${arabicFontClass}`}
                dir="rtl"
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                <span className="text-gray-800">
                  {settings.showTajweed ? (
                    <TajweedText text={ayah.text || ''} fontSizePx={settings.fontSize} />
                  ) : (
                    ayah.text
                  )}
                  <span className="inline-block w-10 h-10 bg-emerald-100 rounded-full text-center leading-10 mr-2 text-emerald-700 font-bold text-sm">
                    {ayah.numberInSurah}
                  </span>
                </span>
              </div>

              {/* Translation */}
              {settings.showTranslation && translationAyah && (
                <div className="text-gray-600 mb-4 leading-relaxed font-kanit">
                  {translationAyah.text}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                {/* Play Audio */}
                {audioAyah?.audio && (
                  <button
                    onClick={() => {
                      if (currentAyah === ayah.number && isPlaying) {
                        audioRef.current?.pause();
                        setIsPlaying(false);
                        setCurrentAyah(null);
                      } else {
                        setCurrentAyah(ayah.number);
                      }
                    }}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-kanit"
                  >
                    {currentAyah === ayah.number && isPlaying
                      ? "⏸️ หยุด"
                      : "▶️ เล่น"}
                  </button>
                )}

                {/* Bookmark */}
                <button
                  onClick={() => toggleBookmark(ayah.number)}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-kanit ${
                    isBookmarked(ayah.number)
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {isBookmarked(ayah.number) ? "🔖 บันทึกแล้ว" : "🔖 บันทึก"}
                </button>

                {/* Ayah Number */}
                <div className="ml-auto text-sm text-gray-500 font-kanit">
                  {surah.number}:{ayah.numberInSurah}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audio Player */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentAyah(null);
        }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
}
