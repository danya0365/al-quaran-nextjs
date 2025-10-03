'use client';

import Link from 'next/link';
import { HomeViewModel } from '@/src/presentation/presenters/home/HomePresenter';
import { useHomePresenter } from '@/src/presentation/presenters/home/useHomePresenter';

interface HomeViewProps {
  initialViewModel?: HomeViewModel;
}

export function HomeView({ initialViewModel }: HomeViewProps) {
  const { viewModel, loading, error, searchQuery, setSearchQuery } = useHomePresenter(initialViewModel);

  // Filter surahs based on search
  const filteredSurahs = viewModel?.surahs.filter((surah) => {
    const query = searchQuery.toLowerCase();
    return (
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.name.includes(query) ||
      surah.number.toString().includes(query)
    );
  });

  if (loading && !viewModel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-kanit">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error && !viewModel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-kanit">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4 font-kanit">{error}</p>
        </div>
      </div>
    );
  }

  if (!viewModel) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 pt-8 pb-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-kanit">อัลกุรอาน</h1>
              <p className="text-emerald-100 text-sm mt-1 font-kanit">Al-Quran Al-Kareem</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาซูเราะห์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 font-kanit"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-6 -mt-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 font-kanit">114</div>
              <div className="text-sm text-gray-600 mt-1 font-kanit">ซูเราะห์</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 font-kanit">6,236</div>
              <div className="text-sm text-gray-600 mt-1 font-kanit">อายะห์</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 font-kanit">30</div>
              <div className="text-sm text-gray-600 mt-1 font-kanit">ญุซอ์</div>
            </div>
          </div>
        </div>
      </div>

      {/* Surah List */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 font-kanit">
            รายการซูเราะห์ ({filteredSurahs?.length || 0})
          </h2>
        </div>

        <div className="space-y-3">
          {filteredSurahs?.map((surah) => (
            <Link
              key={surah.number}
              href={`/surah/${surah.number}`}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-gray-100 hover:border-emerald-200"
            >
              <div className="flex items-center gap-4">
                {/* Number Badge */}
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-bold font-kanit">{surah.number}</span>
                </div>

                {/* Surah Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-800 truncate font-kanit">
                      {surah.englishName}
                    </h3>
                    <span className="text-xl text-gray-700 flex-shrink-0" dir="rtl">
                      {surah.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <span className="font-kanit">{surah.englishNameTranslation}</span>
                    <span>•</span>
                    <span className="font-kanit">
                      {surah.ayahs?.length || 0} อายะห์
                    </span>
                    <span>•</span>
                    <span className="font-kanit">
                      {surah.revelationType === 'Meccan' ? 'มักกะห์' : 'มะดีนะห์'}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-gray-400 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredSurahs?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 font-kanit">ไม่พบซูเราะห์ที่ค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}
