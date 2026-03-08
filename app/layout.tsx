import type { Metadata } from "next";
import {
  Amiri,
  Kanit,
  Lateef,
  Markazi_Text,
  Reem_Kufi,
  Scheherazade_New,
  Tajawal,
} from "next/font/google";
import "../public/styles/index.css";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
});

// Arabic fonts (expose as CSS variables for global usage)
const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
});

const lateef = Lateef({
  weight: ["400"],
  subsets: ["arabic"],
  variable: "--font-lateef",
});

const scheherazade = Scheherazade_New({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-scheherazade",
});

// Extra Arabic fonts
const tajawal = Tajawal({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-tajawal",
});

const reemKufi = Reem_Kufi({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-reemkufi",
});

const markazi = Markazi_Text({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-markazi",
});

export const metadata: Metadata = {
  title: "Al-Quran - อ่านอัลกุรอาน แปลไทยและอังกฤษ พร้อมตัจวีด",
  description:
    "แอปอ่านอัลกุรอาน (Al-Quran) รองรับหลายฟอนต์อาหรับ แสดงตัจวีด บุ๊คมาร์ค และแปลไทย/อังกฤษ มุ่งเน้นประสิทธิภาพและ SEO ด้วย Next.js",
  keywords:
    "quran, al quran, al-quran, mushaf, tajweed, tafseer, translation, แปลคัมภีร์, อัลกุรอาน, ตัจวีด, กุรอาน, อ่านอัลกุรอาน, คัมภีร์อัลกุรอาน, อิสลาม",
  authors: [{ name: "Marosdee Uma" }],
  creator: "Marosdee Uma",
  publisher: "Marosdee Uma",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon.ico" },
    ],
    shortcut: ["/favicon/favicon.ico"],
    apple: ["/favicon/apple-touch-icon.png"],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "Al-Quran - อ่านอัลกุรอานพร้อมตัจวีดและคำแปล",
    description:
      "อ่านอัลกุรอานพร้อมตัจวีด เปลี่ยนฟอนต์อาหรับ ค้นหา บุ๊คมาร์ค และแปลไทย/อังกฤษ",
    url: "/",
    siteName: "Al-Quran",
    images: [
      {
        url: "/favicon/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Al-Quran Logo",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Quran - อ่านอัลกุรอานพร้อมตัจวีดและคำแปล",
    description:
      "อ่านอัลกุรอานพร้อมตัจวีด เปลี่ยนฟอนต์ ค้นหา และบุ๊คมาร์ค แปลไทย/อังกฤษ",
    images: ["/favicon/android-chrome-512x512.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Al-Quran",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${kanit.variable} ${amiri.variable} ${lateef.variable} ${scheherazade.variable} ${tajawal.variable} ${reemKufi.variable} ${markazi.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
