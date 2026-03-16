"use client";

import { useAppVersion } from "@/src/presentation/hooks/useAppVersion";
import { useSettingsPresenter } from "@/src/presentation/presenters/settings/useSettingsPresenter";
import { LANGUAGE_MAP } from "@/src/presentation/presenters/settings/SettingsPresenter";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

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
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-900 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">กำลังโหลดการตั้งค่า...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-900 dark:to-gray-800 text-white px-3 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold">การตั้งค่า</h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            ปรับแต่งการอ่านอัลกุรอาน
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4">
          <div className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Reading Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">การแสดงผลเนื้อหา</h2>

          <div className="space-y-3 sm:space-y-4">
            {/* Font Size */}
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">ขนาดอักษรอาหรับ</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() =>
                    updateSettings({
                      fontSize: Math.max(14, viewModel.settings.fontSize - 2),
                    })
                  }
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-bold text-sm sm:text-base dark:text-gray-200"
                >
                  −
                </button>
                <span className="w-10 sm:w-12 text-center text-sm sm:text-base dark:text-gray-200">
                  {viewModel.settings.fontSize}
                </span>
                  <button
                  onClick={() =>
                    updateSettings({
                      fontSize: Math.min(32, viewModel.settings.fontSize + 2),
                    })
                  }
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-bold text-sm sm:text-base dark:text-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Show Translation */}
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">คำแปลภาษาไทย</span>
              <button
                onClick={() =>
                  updateSettings({
                    showTranslation: !viewModel.settings.showTranslation,
                  })
                }
                className={`w-14 h-7 rounded-full transition-colors ${
                  viewModel.settings.showTranslation
                    ? "bg-emerald-600"
                    : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    viewModel.settings.showTranslation
                      ? "translate-x-7"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Show Tajweed */}
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">แถบสีทัจญ์วีด (Tajweed)</span>
              <button
                onClick={() =>
                  updateSettings({ showTajweed: !viewModel.settings.showTajweed })
                }
                className={`w-14 h-7 rounded-full transition-colors ${
                  viewModel.settings.showTajweed ? "bg-emerald-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    viewModel.settings.showTajweed
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
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">รูปแบบหน้าจอ</h2>
            
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">โหมดสีหน้าจอ (Theme)</span>
              <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg gap-1">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all ${
                    theme === 'light' 
                      ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm font-medium' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  สว่าง
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all ${
                    theme === 'dark' 
                      ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm font-medium' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  มืด
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all ${
                    theme === 'system' 
                      ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm font-medium' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  อัตโนมัติ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Editions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
            เสียงอ่านและสำนวนการแปล
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {/* Translation */}
            <div ref={translationRef}>
              <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2">สำนวนการแปล</label>
              <button
                onClick={() => {
                  setShowTranslationPicker((v) => !v);
                  setShowReciterPicker(false);
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-left text-sm sm:text-base hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
              >
                {viewModel.activeTranslationLabel}
              </button>
              {showTranslationPicker &&
                viewModel.availableTranslations.length > 0 && (
                  <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                      <input
                        value={translationQuery}
                        onChange={(e) => setTranslationQuery(e.target.value)}
                        placeholder="ค้นหาคำแปล..."
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-gray-200 dark:placeholder-gray-400"
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
                                translation.identifier
                              );
                              setShowTranslationPicker(false);
                              setTranslationQuery("");
                            }}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">
                              {translation.language ? LANGUAGE_MAP[translation.language] || translation.language.toUpperCase() : "ไม่ระบุภาษา"}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
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
              <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2">
                เสียงนักอ่าน (Qari)
              </label>
              <button
                onClick={() => {
                  setShowReciterPicker((v) => !v);
                  setShowTranslationPicker(false);
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-left text-sm sm:text-base hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
              >
                {viewModel.activeReciterLabel}
              </button>
              {showReciterPicker && viewModel.availableReciters.length > 0 && (
                <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                  <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                    <input
                      value={reciterQuery}
                      onChange={(e) => setReciterQuery(e.target.value)}
                      placeholder="ค้นหาผู้อ่าน..."
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-gray-200 dark:placeholder-gray-400"
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
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">
                            {reciter.language ? LANGUAGE_MAP[reciter.language] || reciter.language.toUpperCase() : "ไม่ระบุภาษา"}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">ข้อมูลการใช้งานของคุณ</h2>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 sm:p-4 text-center border border-emerald-100/50 dark:border-emerald-800/30">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {viewModel.bookmarksCount}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">อายะห์ที่บันทึกไว้</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 sm:p-4 text-center border border-amber-100/50 dark:border-amber-800/30">
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
                {viewModel.hasLastRead ? "1" : "0"}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">ตำแหน่งอ่านล่าสุด</div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
            เกี่ยวกับ
          </h2>
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <p>แอปพลิเคชันอ่านอัลกุรอาน</p>
            <p>เวอร์ชัน {displayVersion}</p>
            <p>ข้อมูลจาก AlQuran Cloud API</p>
            <p className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-1">
              พัฒนาโดยทีมงานจาก
              <a 
                href="https://cleancode1986-portfolio.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors"
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
