import PodcastView from "@/src/presentation/components/podcast/PodcastView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ฟังต่อเนื่อง - Al-Quran",
  description: "ฟังอัลกุรอานแบบต่อเนื่อง พร้อมข้อความอายะห์",
};

export default function PodcastPage() {
  return <PodcastView />;
}
