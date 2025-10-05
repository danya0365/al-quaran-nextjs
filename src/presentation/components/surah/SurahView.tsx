"use client";

import { SurahViewModel } from "@/src/presentation/presenters/surah/SurahPresenter";
import { useSurahPresenter } from "@/src/presentation/presenters/surah/useSurahPresenter";
import { useQuranStore } from "@/store/quranStore";
import {
  Amiri,
  Lateef,
  Markazi_Text,
  Reem_Kufi,
  Scheherazade_New,
  Tajawal,
} from "next/font/google";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TajweedText from "./TajweedText";
import { getSurahTheme, SurahOrnament } from "./surahThemes";
import { thaiSummariesComplete as thaiSummaries } from "./surahSummaries.th";
import thaiSummariesExtra from "./surahSummaries.extra.th";
import SurahSkeletonView from "./SurahSkeletonView";
// Arabic fonts must be initialized at module scope
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });
const lateef = Lateef({ subsets: ["arabic"], weight: ["400"] });
const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
});
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "700"] });
const reemKufi = Reem_Kufi({ subsets: ["arabic"], weight: ["400", "700"] });
const markazi = Markazi_Text({ subsets: ["arabic"], weight: ["400", "700"] });

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
  const [showSummary, setShowSummary] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const arabicFontClass =
    settings.fontFamily === "Lateef"
      ? lateef.className
      : settings.fontFamily === "ScheherazadeNew"
      ? scheherazade.className
      : settings.fontFamily === "Tajawal"
      ? tajawal.className
      : settings.fontFamily === "ReemKufi"
      ? reemKufi.className
      : settings.fontFamily === "MarkaziText"
      ? markazi.className
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
          <Link
            href="/"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
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
  const theme = getSurahTheme(surah.number);
  const summaries = { ...thaiSummaries, ...thaiSummariesExtra } as typeof thaiSummaries;

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.06), #ffffff)" }}>
      {/* Header */}
      <div
        className="text-white px-6 pt-8 pb-6 shadow-lg sticky top-0 z-10"
        style={{
          background: `linear-gradient(90deg, ${theme.from}, ${theme.to})`,
          color: theme.textOn,
        }}
      >
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

            <div className="flex items-center gap-2">
              {/* Read Summary */}
              <button
                onClick={() => setShowSummary(true)}
                className="px-3 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors text-sm"
              >
                📘 อ่านสรุป
              </button>
              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                ⚙️
              </button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">{surah.englishName}</h1>
            <p className="text-3xl mb-2" dir="rtl">
              {surah.name}
            </p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
              {surah.englishNameTranslation} • {surah.ayahs?.length || 0} อายะห์
              •{surah.revelationType === "Meccan" ? " มักกะห์" : " มะดีนะห์"}
            </p>
          </div>
        </div>
        <div className="absolute right-6 top-6 pointer-events-none select-none" aria-hidden>
          <SurahOrnament color="#FFFFFF" opacity={0.18} />
        </div>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowSummary(false)}
        >
          <div
            className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-800">สรุปซูเราะห์</h3>
              <button
                onClick={() => setShowSummary(false)}
                className="w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200"
                aria-label="close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
                {/* Overview */}
                <div>
                  <div className="text-sm text-gray-600 mb-1">ภาพรวม</div>
                  <p className="text-gray-800 leading-relaxed">
                    {summaries[surah.number].overview}
                  </p>
                </div>

                {/* Themes */}
                {summaries[surah.number].themes?.length ? (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">ประเด็นสำคัญ</div>
                    <ul className="list-disc pl-6 text-gray-800 space-y-1">
                      {summaries[surah.number].themes.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Context */}
                {summaries[surah.number].context ? (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">บริบทการประทาน</div>
                    <p className="text-gray-800 leading-relaxed">
                      {summaries[surah.number].context}
                    </p>
                  </div>
                ) : null}

                {/* Virtues */}
                {summaries[surah.number].virtues ? (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">คุณความดี/คุณวิเศษ</div>
                    <p className="text-gray-800 leading-relaxed">
                      {summaries[surah.number].virtues}
                    </p>
                  </div>
                ) : null}

                <div className="pt-2">
                  <button
                    onClick={() => setShowSummary(false)}
                    className="w-full py-2 rounded-lg text-white"
                    style={{ backgroundColor: theme.accent }}
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

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
              <h3 className="font-semibold text-gray-800">การตั้งค่า</h3>
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
                <span className="text-sm text-gray-600">ขนาดตัวอักษร</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateSettings({
                        fontSize: Math.max(14, settings.fontSize - 2),
                      })
                    }
                    className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-sm">
                    {settings.fontSize}
                  </span>
                  <button
                    onClick={() =>
                      updateSettings({
                        fontSize: Math.min(72, settings.fontSize + 2),
                      })
                    }
                    className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Arabic Font Family */}
              <div>
                <div className="text-sm text-gray-600 mb-2">
                  ฟอนต์ภาษาอาหรับ
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      key: "Amiri",
                      label: "Amiri",
                      className: amiri.className,
                    },
                    {
                      key: "Lateef",
                      label: "Lateef",
                      className: lateef.className,
                    },
                    {
                      key: "ScheherazadeNew",
                      label: "Scheherazade",
                      className: scheherazade.className,
                    },
                    {
                      key: "Tajawal",
                      label: "Tajawal",
                      className: tajawal.className,
                    },
                    {
                      key: "ReemKufi",
                      label: "Reem Kufi",
                      className: reemKufi.className,
                    },
                    {
                      key: "MarkaziText",
                      label: "Markazi Text",
                      className: markazi.className,
                    },
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
                <span className="text-sm text-gray-600">แสดงคำแปล</span>
                <button
                  onClick={() =>
                    updateSettings({
                      showTranslation: !settings.showTranslation,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showTranslation ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.showTranslation
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Show Tajweed */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">แสดงทัจญ์วีด</span>
                <button
                  onClick={() =>
                    updateSettings({ showTajweed: !settings.showTajweed })
                  }
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
                currentAyah === ayah.number ? "ring-2" : ""
              }`}
              style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02)", borderColor: "#F3F4F6", ...(currentAyah === ayah.number ? { outlineColor: theme.accent, outlineStyle: "auto" } : {}) }}
            >
              {/* Arabic Text */}
              <div
                className={`text-right mb-4 leading-loose ${arabicFontClass}`}
                dir="rtl"
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                <span className="text-gray-800">
                  {settings.showTajweed ? (
                    <TajweedText
                      text={ayah.text || ""}
                      fontSizePx={settings.fontSize}
                    />
                  ) : (
                    ayah.text
                  )}
                  <span
                    className="inline-block w-10 h-10 rounded-full text-center leading-10 mr-2 font-bold text-sm"
                    style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
                  >
                    {ayah.numberInSurah}
                  </span>
                </span>
              </div>

              {/* Translation */}
              {settings.showTranslation && translationAyah && (
                <div className="text-gray-600 mb-4 leading-relaxed">
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
                    className="px-4 py-2 rounded-lg transition-colors text-sm"
                    style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
                  >
                    {currentAyah === ayah.number && isPlaying
                      ? "⏸️ หยุด"
                      : "▶️ เล่น"}
                  </button>
                )}

                {/* Bookmark */}
                <button
                  onClick={() => toggleBookmark(ayah.number)}
                  className="px-4 py-2 rounded-lg transition-colors text-sm"
                  style={
                    isBookmarked(ayah.number)
                      ? { backgroundColor: theme.accentSoft, color: theme.accent }
                      : { backgroundColor: "#F9FAFB", color: "#374151" }
                  }
                >
                  {isBookmarked(ayah.number) ? "🔖 บันทึกแล้ว" : "🔖 บันทึก"}
                </button>

                {/* Ayah Number */}
                <div className="ml-auto text-sm text-gray-500">
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
