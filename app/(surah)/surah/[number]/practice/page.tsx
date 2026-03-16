import { PracticeView } from "@/src/presentation/components/surah/practice/PracticeView";
import { SurahPresenterFactory } from "@/src/presentation/presenters/surah/SurahPresenter";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PracticePageProps {
  params: Promise<{ number: string }>;
}

export async function generateMetadata({
  params,
}: PracticePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const presenter = SurahPresenterFactory.create();
  const surahNumber = parseInt(resolvedParams.number);

  try {
    const defaultMeta = await presenter.generateMetadata(surahNumber);
    return {
      title: `${defaultMeta.title} - Practice Mode`,
      description: `Read and recite ${defaultMeta.title} with Practice Mode`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    return {
      title: "Practice Mode - Al-Quran",
      description: "Recite Quran with interactive highlighting",
    };
  }
}

export default async function PracticePage({ params }: PracticePageProps) {
  const resolvedParams = await params;
  const surahNumber = parseInt(resolvedParams.number);

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

  return <PracticeView surahNumber={surahNumber} />;
}
