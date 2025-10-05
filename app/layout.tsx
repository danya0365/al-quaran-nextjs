import type { Metadata } from "next";
import { Kanit, Amiri, Lateef, Scheherazade_New, Tajawal, Reem_Kufi, Markazi_Text } from 'next/font/google';
import "../public/styles/index.css";

const kanit = Kanit({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-kanit',
});

// Arabic fonts (expose as CSS variables for global usage)
const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-amiri',
});

const lateef = Lateef({
  weight: ['400'],
  subsets: ['arabic'],
  variable: '--font-lateef',
});

const scheherazade = Scheherazade_New({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-scheherazade',
});

// Extra Arabic fonts
const tajawal = Tajawal({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-tajawal',
});

const reemKufi = Reem_Kufi({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-reemkufi',
});

const markazi = Markazi_Text({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-markazi',
});

export const metadata: Metadata = {
  title: "Al-Quran",
  description: "Al-Quran App - อ่านอัลกุรอานออนไลน์",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} ${amiri.variable} ${lateef.variable} ${scheherazade.variable} ${tajawal.variable} ${reemKufi.variable} ${markazi.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
