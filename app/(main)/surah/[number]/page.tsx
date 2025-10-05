import { SurahView } from "@/src/presentation/components/surah/SurahView";
import { SurahPresenterFactory } from "@/src/presentation/presenters/surah/SurahPresenter";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface SurahPageProps {
  params: Promise<{ number: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: SurahPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const presenter = SurahPresenterFactory.create();
  const surahNumber = parseInt(resolvedParams.number);

  try {
    return presenter.generateMetadata(surahNumber);
  } catch (error) {
    console.error("Error generating metadata:", error);

    return {
      title: "Al-Quran",
      description: "อ่านอัลกุรอาน",
    };
  }
}

/**
 * Surah detail page - Server Component for SEO optimization
 */
export default async function SurahPage({ params }: SurahPageProps) {
  const resolvedParams = await params;
  const presenter = SurahPresenterFactory.create();
  const surahNumber = parseInt(resolvedParams.number);

  // Validate surah number
  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ไม่พบซูเราะห์
          </h1>
          <p className="text-gray-600 mb-4">หมายเลขซูเราะห์ไม่ถูกต้อง</p>
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

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(surahNumber);

    return <SurahView surahNumber={surahNumber} initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching surah data:", error);

    // Fallback: render without initial data, let client fetch
    return <SurahView surahNumber={surahNumber} />;
  }
}
