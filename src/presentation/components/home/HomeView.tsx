"use client";

import { HomeViewModel } from "@/src/presentation/presenters/home/HomePresenter";
import { useHomePresenter } from "@/src/presentation/presenters/home/useHomePresenter";
import { Amiri } from "next/font/google";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSurahTheme, SurahOrnament } from "../surah/surahThemes";
import HomeSkeletonView from "./HomeSkeletonView";

const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });

interface HomeViewProps {
  initialViewModel?: HomeViewModel;
}

export function HomeView({ initialViewModel }: HomeViewProps) {
  const { viewModel, loading, error, searchQuery, setSearchQuery } =
    useHomePresenter(initialViewModel);

  // Smooth scroll animation for header
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 100; // Distance to complete animation
      const progress = Math.min(scrollPosition / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate dynamic values based on scroll progress
  const headerPadding = {
    paddingTop: `${2 - scrollProgress * 1}rem`,
    paddingBottom: `${1.5 - scrollProgress * 1}rem`,
  };

  const statsOpacity = Math.max(1 - scrollProgress * 1.5, 0); // fade out stats
  const statsHeight = Math.max(1 - scrollProgress * 1.5, 0); // collapse stats

  // Filter surahs based on search - memoized for performance
  const filteredSurahs = useMemo(() => {
    if (!viewModel?.surahs) return [];

    const query = searchQuery.toLowerCase().trim();
    if (!query) return viewModel.surahs;

    return viewModel.surahs.filter((surah) => {
      return (
        surah.englishName.toLowerCase().includes(query) ||
        surah.englishNameTranslation.toLowerCase().includes(query) ||
        surah.name.includes(query) ||
        surah.number.toString().includes(query)
      );
    });
  }, [viewModel?.surahs, searchQuery]);

  if (loading && !viewModel) {
    return <HomeSkeletonView />;
  }

  if (error && !viewModel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-page-gradient">
        <div className="text-center px-4">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-heading mb-2">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-body mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!viewModel) {
    return null;
  }

  return (
    <div className="min-h-screen bg-page-gradient pb-20">
      {/* Header - Smooth Shrinking Sticky */}
      <div
        className="sticky top-0 z-50 bg-header-gradient text-white shadow-lg px-3 sm:px-6"
        style={{
          ...headerPadding,
          transition: "padding 0.1s ease-out",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold">อัลกุรอาน</h1>
              <p className="text-hero-muted text-xs sm:text-sm mt-1">
                Al-Quran Al-Kareem
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-glass-subtle rounded-full flex items-center justify-center">
              <span className="text-xl sm:text-2xl">📖</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3 sm:mb-4">
            <input
              type="text"
              placeholder="ค้นหาซูเราะห์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 rounded-lg sm:rounded-xl input-glass input-focus-ring text-sm sm:text-base"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-dark">
              🔍
            </div>
          </div>

          {/* Stats - Inside Header */}
          {statsOpacity > 0 && (
            <div
              style={{
                opacity: statsOpacity,
                maxHeight: `${statsHeight * 6}rem`,
                overflow: "hidden",
                transition: "opacity 0.1s ease-out, max-height 0.1s ease-out",
              }}
            >
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center bg-glass-subtle rounded-lg sm:rounded-xl p-2.5 sm:p-4">
                <div>
                  <div className="text-xl sm:text-2xl font-bold">114</div>
                  <div className="text-xs text-hero-muted mt-0.5 sm:mt-1">
                    ซูเราะห์
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold">6,236</div>
                  <div className="text-xs text-hero-muted mt-0.5 sm:mt-1">
                    อายะห์
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold">30</div>
                  <div className="text-xs text-hero-muted mt-0.5 sm:mt-1">
                    ญุซอ์
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Surah List */}
      <div className="max-w-4xl mx-auto p-3 sm:p-6">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-lg font-semibold text-heading">
            รายการซูเราะห์ ({filteredSurahs?.length || 0})
          </h2>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {filteredSurahs?.map((surah) => {
            const theme = getSurahTheme(surah.number);
            return (
              <Link
                key={surah.number}
                href={`/surah/${surah.number}`}
                className="relative overflow-hidden block card-hover p-2.5 sm:p-4 group"
              >
                <div className="flex items-center gap-2.5 sm:gap-4">
                  {/* Number Badge */}
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                    }}
                  >
                    <span className="text-white font-bold text-sm sm:text-base">
                      {surah.number}
                    </span>
                  </div>

                  {/* Surah Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                      <h3 className="font-semibold text-sm sm:text-base text-heading truncate link-hover-emerald">
                        {surah.englishName}
                      </h3>
                      <span
                        className={`${amiri.className} text-lg sm:text-xl text-gray-600 dark:text-gray-400 flex-shrink-0 link-hover-emerald`}
                        dir="rtl"
                      >
                        {surah.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 text-xs sm:text-sm text-body">
                      <span>{surah.englishNameTranslation}</span>
                      <span>•</span>
                      <span>{surah.ayahs?.length || 0} อายะห์</span>
                      <span>•</span>
                      <span
                        className="px-1.5 sm:px-2 py-0.5 rounded-full text-xs"
                        style={{
                          backgroundColor: theme.accentSoft,
                          color: theme.accent,
                        }}
                      >
                        {surah.revelationType === "Meccan"
                          ? "มักกะห์"
                          : "มะดีนะห์"}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div
                    className="flex-shrink-0"
                    style={{ color: theme.accent }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                {/* Mini Ornament */}
                <div
                  className="pointer-events-none select-none absolute top-2 right-2"
                  style={{
                    transform: "scale(0.22)",
                    transformOrigin: "top right",
                    opacity: 0.12,
                  }}
                  aria-hidden
                >
                  <SurahOrnament color={theme.accent} opacity={0.2} />
                </div>
              </Link>
            );
          })}
        </div>

        {filteredSurahs?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <p className="text-body">ไม่พบซูเราะห์ที่ค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}
