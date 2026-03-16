"use client";

import { useBookmarksPresenter } from "@/src/presentation/presenters/bookmarks/useBookmarksPresenter";
import { Amiri } from "next/font/google";
import Link from "next/link";

const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });

/**
 * Bookmarks View Component
 * Displays bookmarked ayahs and last read position
 */
export function BookmarksView() {
  const { viewModel, removeBookmark } = useBookmarksPresenter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-900 dark:to-gray-800 text-white px-3 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold">บุ๊คมาร์ค</h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">อายะห์ที่บันทึกไว้</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Last Read */}
        {viewModel.lastRead && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
              อ่านล่าสุด
            </h2>
            <Link
              href={`/surah/${viewModel.lastRead.surah.number}`}
              className="block bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/40 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4 border border-amber-200 dark:border-amber-700/50"
            >
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm sm:text-base">
                  📖
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100 mb-0.5 sm:mb-1">
                    {viewModel.lastRead.surah.englishName}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    อายะห์ที่ {viewModel.lastRead.numberInSurah}
                  </div>
                  <div className={`${amiri.className} text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-1.5 sm:mt-2 leading-relaxed`} dir="rtl">
                    {viewModel.lastRead.text.substring(0, 100)}...
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Bookmarks */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
            บุ๊คมาร์ค ({viewModel.totalBookmarks})
          </h2>

          {viewModel.totalBookmarks === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 opacity-50">🔖</div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">ยังไม่มีบุ๊คมาร์ค</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm">
                บันทึกอายะห์ที่คุณชอบเพื่อกลับมาอ่านภายหลัง
              </p>
              <Link
                href="/home"
                className="inline-block mt-3 sm:mt-4 bg-emerald-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-emerald-700 transition-colors"
              >
                เริ่มอ่านอัลกุรอาน
              </Link>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {viewModel.bookmarks.map((bookmark) => (
                <div
                  key={bookmark.number}
                  className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="flex-1">
                      <Link
                        href={`/surah/${bookmark.surah.number}`}
                        className="block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        <div className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100 mb-0.5 sm:mb-1">
                          {bookmark.surah.englishName} - อายะห์ที่{" "}
                          {bookmark.numberInSurah}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2">
                          {bookmark.surah.englishNameTranslation}
                        </div>
                        <div
                          className={`${amiri.className} text-gray-700 dark:text-gray-300 leading-relaxed text-sm`}
                          dir="rtl"
                        >
                          {bookmark.text}
                        </div>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeBookmark(bookmark.number)}
                      className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center text-sm sm:text-base"
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
