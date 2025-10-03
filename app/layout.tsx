import type { Metadata } from "next";
import { Kanit } from 'next/font/google';
import "../public/styles/index.css";

const kanit = Kanit({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-kanit',
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
      <body className={`${kanit.variable} antialiased`}>{children}</body>
    </html>
  );
}
