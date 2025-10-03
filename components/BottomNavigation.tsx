'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'หน้าแรก',
      icon: '📚',
      href: '/home',
      active: pathname === '/home' || pathname === '/',
    },
    {
      name: 'บุ๊คมาร์ค',
      icon: '🔖',
      href: '/bookmarks',
      active: pathname === '/bookmarks',
    },
    {
      name: 'ตั้งค่า',
      icon: '⚙️',
      href: '/settings',
      active: pathname === '/settings',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium font-kanit">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
