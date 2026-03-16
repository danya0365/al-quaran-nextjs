import { KaraokeView } from "@/src/presentation/components/surah/karaoke/KaraokeView";
import { SurahPresenterFactory } from "@/src/presentation/presenters/surah/SurahPresenter";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface KaraokePageProps {
  params: Promise<{ number: string }>;
}

export async function generateMetadata({
  params,
}: KaraokePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const presenter = SurahPresenterFactory.create();
  const surahNumber = parseInt(resolvedParams.number);

  try {
    const defaultMeta = await presenter.generateMetadata(surahNumber);
    return {
      title: `${defaultMeta.title} - Karaoke Mode`,
      description: `Read and recite ${defaultMeta.title} with Karaoke Mode`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    return {
      title: "Karaoke Mode - Al-Quran",
      description: "Recite Quran with interactive highlighting",
    };
  }
}

export default async function KaraokePage({ params }: KaraokePageProps) {
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

  return <KaraokeView surahNumber={surahNumber} />;
}
