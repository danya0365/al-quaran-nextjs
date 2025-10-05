import { HomeView } from '@/src/presentation/components/home/HomeView';
import { HomePresenterFactory } from '@/src/presentation/presenters/home/HomePresenter';
import type { Metadata } from 'next';

// Use ISR (Incremental Static Regeneration) instead of force-dynamic
// This will statically generate the page and revalidate every hour
export const revalidate = 3600; // Revalidate every 1 hour

/**
 * Static metadata for better performance
 */
export const metadata: Metadata = {
  title: 'Al-Quran - รายการซูเราะห์',
  description: 'อ่านอัลกุรอานทั้ง 114 ซูเราะห์ พร้อมคำแปล และเสียงอ่าน',
  keywords: 'อัลกุรอาน, Al-Quran, ซูเราะห์, Surah, อิสลาม, Islam',
};

/**
 * Home page - Server Component for SEO optimization
 */
export default async function HomePage() {
  const presenter = HomePresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return <HomeView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching home data:', error);

    // Fallback: render without initial data, let client fetch
    return <HomeView />;
  }
}
