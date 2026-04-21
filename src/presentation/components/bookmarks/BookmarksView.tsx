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
    <div className="min-h-screen bg-page-gradient pb-20">
      {/* Header */}
      <div className="bg-header-gradient text-white px-3 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold">บุ๊คมาร์ค</h1>
          <p className="text-hero-muted text-xs sm:text-sm mt-1">
            อายะห์ที่บันทึกไว้
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Last Read */}
        {viewModel.lastRead && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-heading mb-2 sm:mb-3">
              อ่านล่าสุด
            </h2>
            <Link
              href={`/surah/${viewModel.lastRead.surah.number}`}
              className="block card-hover bg-warning-light/30 dark:bg-warning-dark/20 rounded-lg sm:rounded-xl p-3 sm:p-4"
            >
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-warning rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm sm:text-base">
                  📖
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base text-heading mb-0.5 sm:mb-1">
                    {viewModel.lastRead.surah.englishName}
                  </div>
                  <div className="text-xs sm:text-sm text-body">
                    อายะห์ที่ {viewModel.lastRead.numberInSurah}
                  </div>
                  <div
                    className={`${amiri.className} text-sm sm:text-base text-on-surface mt-1.5 sm:mt-2 leading-relaxed`}
                    dir="rtl"
                  >
                    {viewModel.lastRead.text.substring(0, 100)}...
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Bookmarks */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-heading mb-2 sm:mb-3">
            บุ๊คมาร์ค ({viewModel.totalBookmarks})
          </h2>

          {viewModel.totalBookmarks === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 opacity-50">
                🔖
              </div>
              <p className="text-sm sm:text-base text-body mb-2">
                ยังไม่มีบุ๊คมาร์ค
              </p>
              <p className="text-muted-dark text-xs sm:text-sm">
                บันทึกอายะห์ที่คุณชอบเพื่อกลับมาอ่านภายหลัง
              </p>
              <Link
                href="/home"
                className="inline-block mt-3 sm:mt-4 bg-primary text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-primary-dark transition-colors"
              >
                เริ่มอ่านอัลกุรอาน
              </Link>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {viewModel.bookmarks.map((bookmark) => (
                <div
                  key={bookmark.number}
                  className="bg-surface rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-border"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="flex-1">
                      <Link
                        href={`/surah/${bookmark.surah.number}`}
                        className="block hover:text-primary dark:hover:text-primary-dark transition-colors"
                      >
                        <div className="font-semibold text-sm sm:text-base text-heading mb-0.5 sm:mb-1">
                          {bookmark.surah.englishName} - อายะห์ที่{" "}
                          {bookmark.numberInSurah}
                        </div>
                        <div className="text-xs sm:text-sm text-body mb-1.5 sm:mb-2">
                          {bookmark.surah.englishNameTranslation}
                        </div>
                        <div
                          className={`${amiri.className} text-on-surface leading-relaxed text-sm`}
                          dir="rtl"
                        >
                          {bookmark.text}
                        </div>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeBookmark(bookmark.number)}
                      className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-error-light dark:bg-error-dark/20 text-error rounded-lg hover:bg-error/10 dark:hover:bg-error-dark/30 transition-colors flex items-center justify-center text-sm sm:text-base"
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
