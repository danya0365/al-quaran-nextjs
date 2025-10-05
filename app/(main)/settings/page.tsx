import { SettingsView } from "@/src/presentation/components/settings/SettingsView";
import { SettingsPresenterFactory } from "@/src/presentation/presenters/settings/SettingsPresenter";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = SettingsPresenterFactory.create();
  return presenter.generateMetadata();
}

/**
 * Settings page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default function SettingsPage() {
  return <SettingsView />;
}
