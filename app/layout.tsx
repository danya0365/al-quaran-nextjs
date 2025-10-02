import type { Metadata } from "next";
import "../public/styles/index.css";

export const metadata: Metadata = {
  title: "Al-Quran",
  description: "Al-Quran App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
