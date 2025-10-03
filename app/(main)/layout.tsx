import { BottomNavigation } from '@/components/BottomNavigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <main>{children}</main>
      <BottomNavigation />
    </div>
  );
}
