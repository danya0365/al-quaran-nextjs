import { BookmarksView } from "@/src/presentation/components/bookmarks/BookmarksView";
import { BookmarksPresenterFactory } from "@/src/presentation/presenters/bookmarks/BookmarksPresenter";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = BookmarksPresenterFactory.create();
  return presenter.generateMetadata();
}

/**
 * Bookmarks page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default function BookmarksPage() {
  return <BookmarksView />;
}
