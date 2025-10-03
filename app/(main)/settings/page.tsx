'use client';

import { useQuranStore } from '@/store/quranStore';
import { useState } from 'react';

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    activeEditions,
    setActiveEdition,
    availableTranslations,
    availableReciters,
    bookmarks,
    lastRead,
  } = useQuranStore();

  const [showTranslationPicker, setShowTranslationPicker] = useState(false);
  const [showReciterPicker, setShowReciterPicker] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 pt-8 pb-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold font-kanit">การตั้งค่า</h1>
          <p className="text-emerald-100 text-sm mt-1 font-kanit">
            ปรับแต่งการอ่านอัลกุรอาน
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Reading Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-kanit">
            การอ่าน
          </h2>

          <div className="space-y-4">
            {/* Font Size */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-kanit">ขนาดตัวอักษร</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateSettings({
                      fontSize: Math.max(14, settings.fontSize - 2),
                    })
                  }
                  className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-bold"
                >
                  −
                </button>
                <span className="w-12 text-center font-kanit">
                  {settings.fontSize}
                </span>
                <button
                  onClick={() =>
                    updateSettings({
                      fontSize: Math.min(32, settings.fontSize + 2),
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
              <span className="text-gray-700 font-kanit">แสดงคำแปล</span>
              <button
                onClick={() =>
                  updateSettings({ showTranslation: !settings.showTranslation })
                }
                className={`w-14 h-7 rounded-full transition-colors ${
                  settings.showTranslation ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.showTranslation ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Show Tajweed */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-kanit">แสดงทัจญ์วีด</span>
              <button
                onClick={() =>
                  updateSettings({ showTajweed: !settings.showTajweed })
                }
                className={`w-14 h-7 rounded-full transition-colors ${
                  settings.showTajweed ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.showTajweed ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Editions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-kanit">
            ฉบับที่ใช้
          </h2>

          <div className="space-y-4">
            {/* Translation */}
            <div>
              <label className="block text-sm text-gray-600 mb-2 font-kanit">
                คำแปล
              </label>
              <button
                onClick={() => setShowTranslationPicker(!showTranslationPicker)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-left hover:bg-gray-100 transition-colors font-kanit"
              >
                {activeEditions.translation}
              </button>
              {showTranslationPicker && availableTranslations.length > 0 && (
                <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                  {availableTranslations.slice(0, 10).map((translation) => (
                    <button
                      key={translation.identifier}
                      onClick={() => {
                        setActiveEdition('translation', translation.identifier);
                        setShowTranslationPicker(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium font-kanit">
                        {translation.englishName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {translation.language}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reciter */}
            <div>
              <label className="block text-sm text-gray-600 mb-2 font-kanit">
                ผู้อ่าน
              </label>
              <button
                onClick={() => setShowReciterPicker(!showReciterPicker)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-left hover:bg-gray-100 transition-colors font-kanit"
              >
                {activeEditions.audio}
              </button>
              {showReciterPicker && availableReciters.length > 0 && (
                <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                  {availableReciters.slice(0, 10).map((reciter) => (
                    <button
                      key={reciter.identifier}
                      onClick={() => {
                        setActiveEdition('audio', reciter.identifier);
                        setShowReciterPicker(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium font-kanit">
                        {reciter.englishName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reciter.language}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-kanit">
            สถิติ
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-emerald-600 font-kanit">
                {bookmarks.length}
              </div>
              <div className="text-sm text-gray-600 mt-1 font-kanit">
                บุ๊คมาร์ค
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-amber-600 font-kanit">
                {lastRead ? '1' : '0'}
              </div>
              <div className="text-sm text-gray-600 mt-1 font-kanit">
                อ่านล่าสุด
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-kanit">
            เกี่ยวกับ
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-kanit">แอปพลิเคชันอ่านอัลกุรอาน</p>
            <p className="font-kanit">เวอร์ชัน 1.0.0</p>
            <p className="font-kanit">
              ข้อมูลจาก AlQuran Cloud API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
