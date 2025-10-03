import { HomeView } from '@/src/presentation/components/home/HomeView';
import { HomePresenterFactory } from '@/src/presentation/presenters/home/HomePresenter';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = HomePresenterFactory.create();
  
  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    return {
      title: 'Al-Quran - รายการซูเราะห์',
      description: 'อ่านอัลกุรอานทั้ง 114 ซูเราะห์',
    };
  }
}

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
