"use client";

import { useSettingsPresenter } from "@/src/presentation/presenters/settings/useSettingsPresenter";
import { useEffect, useRef, useState } from "react";

/**
 * Settings View Component
 * Displays app settings with customizable options
 */
export function SettingsView() {
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

  // Show loading state
  if (loading && viewModel.availableTranslations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดการตั้งค่า...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 pt-8 pb-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">การตั้งค่า</h1>
          <p className="text-emerald-100 text-sm mt-1">
            ปรับแต่งการอ่านอัลกุรอาน
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="max-w-4xl mx-auto px-6 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Reading Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">การอ่าน</h2>

          <div className="space-y-4">
            {/* Font Size */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">ขนาดตัวอักษร</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateSettings({
                      fontSize: Math.max(14, viewModel.settings.fontSize - 2),
                    })
                  }
                  className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-bold"
                >
                  −
                </button>
                <span className="w-12 text-center">
                  {viewModel.settings.fontSize}
                </span>
                <button
                  onClick={() =>
                    updateSettings({
                      fontSize: Math.min(32, viewModel.settings.fontSize + 2),
                    })
                  }
                  className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Show Translation */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">แสดงคำแปล</span>
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
              <span className="text-gray-700">แสดงทัจญ์วีด</span>
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

        {/* Editions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ฉบับที่ใช้
          </h2>

          <div className="space-y-4">
            {/* Translation */}
            <div ref={translationRef}>
              <label className="block text-sm text-gray-600 mb-2">คำแปล</label>
              <button
                onClick={() => {
                  setShowTranslationPicker((v) => !v);
                  setShowReciterPicker(false);
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-left hover:bg-gray-100 transition-colors"
              >
                {viewModel.activeTranslationLabel}
              </button>
              {showTranslationPicker &&
                viewModel.availableTranslations.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        value={translationQuery}
                        onChange={(e) => setTranslationQuery(e.target.value)}
                        placeholder="ค้นหาคำแปล..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
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
                            className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium">
                              {translation.englishName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {translation.language}
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Reciter */}
            <div ref={reciterRef}>
              <label className="block text-sm text-gray-600 mb-2">
                ผู้อ่าน
              </label>
              <button
                onClick={() => {
                  setShowReciterPicker((v) => !v);
                  setShowTranslationPicker(false);
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-left hover:bg-gray-100 transition-colors"
              >
                {viewModel.activeReciterLabel}
              </button>
              {showReciterPicker && viewModel.availableReciters.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg">
                  <div className="p-2 border-b border-gray-100">
                    <input
                      value={reciterQuery}
                      onChange={(e) => setReciterQuery(e.target.value)}
                      placeholder="ค้นหาผู้อ่าน..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
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
                          className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">
                            {reciter.englishName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {reciter.language}
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
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">สถิติ</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {viewModel.bookmarksCount}
              </div>
              <div className="text-sm text-gray-600 mt-1">บุ๊คมาร์ค</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-amber-600">
                {viewModel.hasLastRead ? "1" : "0"}
              </div>
              <div className="text-sm text-gray-600 mt-1">อ่านล่าสุด</div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            เกี่ยวกับ
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>แอปพลิเคชันอ่านอัลกุรอาน</p>
            <p>เวอร์ชัน 1.0.0</p>
            <p>ข้อมูลจาก AlQuran Cloud API</p>
          </div>
        </div>
      </div>
    </div>
  );
}
