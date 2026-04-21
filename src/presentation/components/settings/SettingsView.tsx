"use client";

import { useAppVersion } from "@/src/presentation/hooks/useAppVersion";
import { LANGUAGE_MAP } from "@/src/presentation/presenters/settings/SettingsPresenter";
import { useSettingsPresenter } from "@/src/presentation/presenters/settings/useSettingsPresenter";
import { useTheme } from "next-themes";
import {
  Amiri,
  Lateef,
  Markazi_Text,
  Reem_Kufi,
  Scheherazade_New,
  Tajawal,
} from "next/font/google";
import { useEffect, useRef, useState } from "react";

// Initialize Arabic fonts
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });
const lateef = Lateef({ subsets: ["arabic"], weight: ["400", "700"] });
const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
});
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "700"] });
const reemKufi = Reem_Kufi({ subsets: ["arabic"], weight: ["400", "700"] });
const markazi = Markazi_Text({ subsets: ["arabic"], weight: ["400", "700"] });

/**
 * Settings View Component
 * Displays app settings with customizable options
 */
export function SettingsView() {
  const { displayVersion } = useAppVersion();
  const {
    viewModel,
    loading,
    error,
    updateSettings,
    setActiveEdition,
    filterTranslations,
    filterReciters,
  } = useSettingsPresenter();

  // Local UI states
  const [showTranslationPicker, setShowTranslationPicker] = useState(false);
  const [showReciterPicker, setShowReciterPicker] = useState(false);
  const [translationQuery, setTranslationQuery] = useState("");
  const [reciterQuery, setReciterQuery] = useState("");

  // Theme handling
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Refs for detecting outside clicks
  const translationRef = useRef<HTMLDivElement | null>(null);
  const reciterRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click / Escape key
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTranslation = translationRef.current?.contains(target);
      const inReciter = reciterRef.current?.contains(target);
      if (!inTranslation) setShowTranslationPicker(false);
      if (!inReciter) setShowReciterPicker(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowTranslationPicker(false);
        setShowReciterPicker(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Hydration fix for next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state
  if (loading && viewModel.availableTranslations.length === 0) {
    return (
      <div className="min-h-screen bg-page-gradient pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-body">กำลังโหลดการตั้งค่า...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-gradient pb-20">
      {/* Header */}
      <div className="bg-header-gradient text-white px-3 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold">การตั้งค่า</h1>
          <p className="text-hero-muted text-xs sm:text-sm mt-1">
            ปรับแต่งการอ่านอัลกุรอาน
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4">
          <div className="bg-error-light dark:bg-error-dark/20 border border-error dark:border-error text-error-dark dark:text-error px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Reading Settings */}
        <div className="bg-surface rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-border">
          <h2 className="text-base sm:text-lg font-semibold text-heading mb-3 sm:mb-4">
            การแสดงผลเนื้อหา
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {/* Font Size */}
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-on-surface">
                ขนาดอักษรอาหรับ
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() =>
                    updateSettings({
                      fontSize: Math.max(14, viewModel.settings.fontSize - 2),
                    })
                  }
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-muted rounded-lg hover:bg-muted-light transition-colors font-bold text-sm sm:text-base text-on-surface"
                >
                  −
                </button>
                <span className="w-10 sm:w-12 text-center text-sm sm:text-base text-on-surface">
                  {viewModel.settings.fontSize}
                </span>
                <button
                  onClick={() =>
                    updateSettings({
                      fontSize: Math.min(32, viewModel.settings.fontSize + 2),
                    })
                  }
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-muted rounded-lg hover:bg-muted-light transition-colors font-bold text-sm sm:text-base text-on-surface"
                >
                  +
                </button>
              </div>
            </div>

            {/* Show Translation */}
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-on-surface">
                แสดงคำแปล
              </span>
              <button
                onClick={() =>
                  updateSettings({
                    showTranslation: !viewModel.settings.showTranslation,
                  })
                }
                className={`w-14 h-7 rounded-full transition-colors ${
                  viewModel.settings.showTranslation
                    ? "bg-primary"
                    : "bg-muted-dark"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-surface rounded-full transition-transform ${
                    viewModel.settings.showTranslation
                      ? "translate-x-7"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Show Tajweed */}
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-on-surface">
                แถบสีทัจญ์วีด (Tajweed)
              </span>
              <button
                onClick={() =>
                  updateSettings({
                    showTajweed: !viewModel.settings.showTajweed,
                  })
                }
                className={`w-14 h-7 rounded-full transition-colors ${
                  viewModel.settings.showTajweed
                    ? "bg-primary"
                    : "bg-muted-dark"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-surface rounded-full transition-transform ${
                    viewModel.settings.showTajweed
                      ? "translate-x-7"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Font Family Selector */}
            <div className="pt-2">
              <span className="text-sm sm:text-base text-on-surface block mb-2">
                ฟอนต์อาหรับ
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
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
                    label: "Markazi",
                    className: markazi.className,
                  },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => updateSettings({ fontFamily: f.key })}
                    className={`p-2 sm:p-3 rounded-lg border text-center text-xs sm:text-sm ${
                      viewModel.settings.fontFamily === f.key
                        ? "border-primary bg-success-light/50 dark:bg-success-dark/20"
                        : "border-border bg-muted hover:bg-muted-light"
                    } ${f.className}`}
                  >
                    <span className="dark:text-on-surface">بِسْمِ</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Play */}
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-on-surface">
                เล่นอัตโนมัติ
              </span>
              <button
                onClick={() =>
                  updateSettings({
                    autoPlay: !viewModel.settings.autoPlay,
                  })
                }
                className={`w-14 h-7 rounded-full transition-colors ${
                  viewModel.settings.autoPlay ? "bg-primary" : "bg-muted-dark"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-surface rounded-full transition-transform ${
                    viewModel.settings.autoPlay
                      ? "translate-x-7"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Auto Scroll */}
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-on-surface">
                เลื่อนอัตโนมัติ
              </span>
              <button
                onClick={() =>
                  updateSettings({
                    autoScroll: !viewModel.settings.autoScroll,
                  })
                }
                className={`w-14 h-7 rounded-full transition-colors ${
                  viewModel.settings.autoScroll ? "bg-primary" : "bg-muted-dark"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-surface rounded-full transition-transform ${
                    viewModel.settings.autoScroll
                      ? "translate-x-7"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        {mounted && (
          <div className="bg-surface rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-border">
            <h2 className="text-base sm:text-lg font-semibold text-heading mb-3 sm:mb-4">
              รูปแบบหน้าจอ
            </h2>

            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-on-surface">
                โหมดสีหน้าจอ (Theme)
              </span>
              <div className="flex bg-muted p-1 rounded-lg gap-1">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all ${
                    theme === "light"
                      ? "bg-surface text-primary shadow-sm font-medium"
                      : "text-muted-dark hover:text-on-surface"
                  }`}
                >
                  สว่าง
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all ${
                    theme === "dark"
                      ? "bg-surface text-primary shadow-sm font-medium"
                      : "text-muted-dark hover:text-on-surface"
                  }`}
                >
                  มืด
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all ${
                    theme === "system"
                      ? "bg-surface text-primary shadow-sm font-medium"
                      : "text-muted-dark hover:text-on-surface"
                  }`}
                >
                  อัตโนมัติ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Editions */}
        <div className="bg-surface rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-border">
          <h2 className="text-base sm:text-lg font-semibold text-heading mb-3 sm:mb-4">
            เสียงอ่านและสำนวนการแปล
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {/* Translation */}
            <div ref={translationRef}>
              <label className="block text-xs sm:text-sm text-body mb-1.5 sm:mb-2">
                สำนวนการแปล
              </label>
              <button
                onClick={() => {
                  setShowTranslationPicker((v) => !v);
                  setShowReciterPicker(false);
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-muted/50 border border-border rounded-lg text-left text-sm sm:text-base hover:bg-muted transition-colors text-on-surface"
              >
                {viewModel.activeTranslationLabel}
              </button>
              {showTranslationPicker &&
                viewModel.availableTranslations.length > 0 && (
                  <div className="mt-2 border border-border rounded-lg bg-surface shadow-lg">
                    <div className="p-2 border-b border-border">
                      <input
                        value={translationQuery}
                        onChange={(e) => setTranslationQuery(e.target.value)}
                        placeholder="ค้นหาคำแปล..."
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-on-surface placeholder-muted-dark"
                      />
                    </div>
                    <div className="max-h-48 sm:max-h-60 overflow-y-auto">
                      {filterTranslations(translationQuery)
                        .slice(0, 50)
                        .map((translation) => (
                          <button
                            key={translation.identifier}
                            onClick={() => {
                              setActiveEdition(
                                "translation",
                                translation.identifier,
                              );
                              setShowTranslationPicker(false);
                              setTranslationQuery("");
                            }}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-success-light/50 dark:hover:bg-success-dark/20 transition-colors border-b border-border last:border-b-0"
                          >
                            <div className="font-medium text-sm sm:text-base text-on-surface">
                              {translation.language
                                ? LANGUAGE_MAP[translation.language] ||
                                  translation.language.toUpperCase()
                                : "ไม่ระบุภาษา"}
                            </div>
                            <div className="text-xs sm:text-sm text-body mt-0.5">
                              แปลโดย: {translation.englishName}
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Reciter */}
            <div ref={reciterRef}>
              <label className="block text-xs sm:text-sm text-body mb-1.5 sm:mb-2">
                เสียงนักอ่าน (Qari)
              </label>
              <button
                onClick={() => {
                  setShowReciterPicker((v) => !v);
                  setShowTranslationPicker(false);
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-muted/50 border border-border rounded-lg text-left text-sm sm:text-base hover:bg-muted transition-colors text-on-surface"
              >
                {viewModel.activeReciterLabel}
              </button>
              {showReciterPicker && viewModel.availableReciters.length > 0 && (
                <div className="mt-2 border border-border rounded-lg bg-surface shadow-lg">
                  <div className="p-2 border-b border-border">
                    <input
                      value={reciterQuery}
                      onChange={(e) => setReciterQuery(e.target.value)}
                      placeholder="ค้นหาผู้อ่าน..."
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-on-surface placeholder-muted-dark"
                    />
                  </div>
                  <div className="max-h-48 sm:max-h-60 overflow-y-auto">
                    {filterReciters(reciterQuery)
                      .slice(0, 50)
                      .map((reciter) => (
                        <button
                          key={reciter.identifier}
                          onClick={() => {
                            setActiveEdition("audio", reciter.identifier);
                            setShowReciterPicker(false);
                            setReciterQuery("");
                          }}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-success-light/50 dark:hover:bg-success-dark/20 transition-colors border-b border-border last:border-b-0"
                        >
                          <div className="font-medium text-sm sm:text-base text-on-surface">
                            {reciter.language
                              ? LANGUAGE_MAP[reciter.language] ||
                                reciter.language.toUpperCase()
                              : "ไม่ระบุภาษา"}
                          </div>
                          <div className="text-xs sm:text-sm text-body mt-0.5">
                            เสียงอ่านโดย: {reciter.englishName}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-surface rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-border">
          <h2 className="text-base sm:text-lg font-semibold text-heading mb-3 sm:mb-4">
            ข้อมูลการใช้งานของคุณ
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-success-light/50 dark:bg-success-dark/20 rounded-lg p-3 sm:p-4 text-center border border-success/20">
              <div className="text-2xl sm:text-3xl font-bold text-success">
                {viewModel.bookmarksCount}
              </div>
              <div className="text-xs sm:text-sm text-body mt-0.5 sm:mt-1">
                อายะห์ที่บันทึกไว้
              </div>
            </div>
            <div className="bg-warning-light/50 dark:bg-warning-dark/20 rounded-lg p-3 sm:p-4 text-center border border-warning/20">
              <div className="text-2xl sm:text-3xl font-bold text-warning">
                {viewModel.hasLastRead ? "1" : "0"}
              </div>
              <div className="text-xs sm:text-sm text-body mt-0.5 sm:mt-1">
                ตำแหน่งอ่านล่าสุด
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-surface rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-border">
          <h2 className="text-base sm:text-lg font-semibold text-heading mb-3 sm:mb-4">
            เกี่ยวกับ
          </h2>
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-body">
            <p>แอปพลิเคชันอ่านอัลกุรอาน</p>
            <p>เวอร์ชัน {displayVersion}</p>
            <p>ข้อมูลจาก AlQuran Cloud API</p>
            <p className="pt-2 mt-2 border-t border-border flex flex-wrap items-center gap-1">
              พัฒนาโดยทีมงานจาก
              <a
                href="https://cleancode1986-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark font-medium hover:underline transition-colors"
              >
                CleanCode1986
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
