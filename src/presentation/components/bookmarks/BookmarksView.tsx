"use client";

import { useBookmarksPresenter } from "@/src/presentation/presenters/bookmarks/useBookmarksPresenter";
import Link from "next/link";

/**
 * Bookmarks View Component
 * Displays bookmarked ayahs and last read position
 */
export function BookmarksView() {
  const { viewModel, removeBookmark } = useBookmarksPresenter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 pt-8 pb-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">บุ๊คมาร์ค</h1>
          <p className="text-emerald-100 text-sm mt-1">อายะห์ที่บันทึกไว้</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Last Read */}
        {viewModel.lastRead && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              อ่านล่าสุด
            </h2>
            <Link
              href={`/surah/${viewModel.lastRead.surah.number}`}
              className="block bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-amber-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold">
                  📖
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 mb-1">
                    {viewModel.lastRead.surah.englishName}
                  </div>
                  <div className="text-sm text-gray-600">
                    อายะห์ที่ {viewModel.lastRead.numberInSurah}
                  </div>
                  <div className="text-gray-700 mt-2 leading-relaxed" dir="rtl">
                    {viewModel.lastRead.text.substring(0, 100)}...
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Bookmarks */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            บุ๊คมาร์ค ({viewModel.totalBookmarks})
          </h2>

          {viewModel.totalBookmarks === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔖</div>
              <p className="text-gray-600 mb-2">ยังไม่มีบุ๊คมาร์ค</p>
              <p className="text-gray-500 text-sm">
                บันทึกอายะห์ที่คุณชอบเพื่อกลับมาอ่านภายหลัง
              </p>
              <Link
                href="/home"
                className="inline-block mt-4 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                เริ่มอ่านอัลกุรอาน
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {viewModel.bookmarks.map((bookmark) => (
                <div
                  key={bookmark.number}
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <Link
                        href={`/surah/${bookmark.surah.number}`}
                        className="block hover:text-emerald-600 transition-colors"
                      >
                        <div className="font-semibold text-gray-800 mb-1">
                          {bookmark.surah.englishName} - อายะห์ที่{" "}
                          {bookmark.numberInSurah}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {bookmark.surah.englishNameTranslation}
                        </div>
                        <div
                          className="text-gray-700 leading-relaxed text-sm"
                          dir="rtl"
                        >
                          {bookmark.text}
                        </div>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeBookmark(bookmark.number)}
                      className="flex-shrink-0 w-8 h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                      title="ลบบุ๊คมาร์ค"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
