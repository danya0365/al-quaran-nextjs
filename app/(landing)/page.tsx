'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-quran-gradient overflow-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-backdrop-light backdrop-blur-xl shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-glow rounded-lg flex items-center justify-center shadow-emerald">
                <span className="text-2xl">📖</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Al-Quran</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-white/80 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-white/80 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#stats"
                className="text-white/80 hover:text-white transition-colors"
              >
                Stats
              </a>
              <Link
                href="/quran"
                className="bg-emerald-glow hover:bg-emerald-glow text-white px-6 py-2 rounded-lg font-medium transition-all shadow-emerald hover:shadow-emerald hover:scale-105"
              >
                Start Reading
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center space-x-2 bg-glass-light border border-white/20 rounded-full px-6 py-3 mb-8 backdrop-blur-xl">
              <span className="text-golden-bright text-2xl">✨</span>
              <span className="text-white/90 text-sm font-medium">
                Modern Quran Reading Experience
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Read & Understand
              <br />
              <span className="text-quran-gradient">The Noble Quran</span>
            </h2>

            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Experience the divine words with beautiful Arabic script,
              translations, audio recitations, and powerful study tools.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/quran"
                className="bg-emerald-glow hover:bg-emerald-glow text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-emerald hover:shadow-emerald hover:scale-105 w-full sm:w-auto text-center"
              >
                Start Reading Now →
              </Link>
              <a
                href="#features"
                className="bg-glass-light hover:bg-glass-light text-white px-8 py-4 rounded-xl font-semibold transition-all border border-white/20 backdrop-blur-xl w-full sm:w-auto text-center"
              >
                Explore Features
              </a>
            </div>

            {/* Floating Cards Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-glass-light transition-all shadow-lg hover:shadow-emerald hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-glow rounded-xl flex items-center justify-center mb-4 mx-auto shadow-emerald">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  114 Surahs
                </h3>
                <p className="text-white/60 text-sm">
                  Complete Quran with all chapters
                </p>
              </div>

              <div className="bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-glass-light transition-all shadow-lg hover:shadow-golden hover:-translate-y-1">
                <div className="w-12 h-12 bg-golden rounded-xl flex items-center justify-center mb-4 mx-auto shadow-golden">
                  <span className="text-2xl">🎧</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Audio Recitations
                </h3>
                <p className="text-white/60 text-sm">
                  Listen from multiple reciters
                </p>
              </div>

              <div className="bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-glass-light transition-all shadow-lg hover:shadow-emerald hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-glow rounded-xl flex items-center justify-center mb-4 mx-auto shadow-emerald">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Multiple Translations
                </h3>
                <p className="text-white/60 text-sm">
                  Read in various languages
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Background Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-glow/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-golden/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Everything you need for a meaningful Quran reading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-emerald hover:-translate-y-2">
              <div className="w-16 h-16 bg-emerald-glow rounded-2xl flex items-center justify-center mb-6 shadow-emerald group-hover:scale-110 transition-transform">
                <span className="text-3xl">📖</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                Beautiful Typography
              </h3>
              <p className="text-white/60">
                Read with stunning Arabic fonts, customizable text size, and
                Tajweed highlighting for proper pronunciation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-golden hover:-translate-y-2">
              <div className="w-16 h-16 bg-golden rounded-2xl flex items-center justify-center mb-6 shadow-golden group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎵</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                Audio Recitations
              </h3>
              <p className="text-white/60">
                Listen to beautiful recitations from renowned Qaris. Download
                for offline listening anytime, anywhere.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-emerald hover:-translate-y-2">
              <div className="w-16 h-16 bg-emerald-glow rounded-2xl flex items-center justify-center mb-6 shadow-emerald group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                Multi-Language Support
              </h3>
              <p className="text-white/60">
                Access translations in multiple languages to understand the
                meanings of verses clearly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-golden hover:-translate-y-2">
              <div className="w-16 h-16 bg-golden rounded-2xl flex items-center justify-center mb-6 shadow-golden group-hover:scale-110 transition-transform">
                <span className="text-3xl">💾</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                Offline Reading
              </h3>
              <p className="text-white/60">
                Download surahs and read without internet. Perfect for travel
                and areas with limited connectivity.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-emerald hover:-translate-y-2">
              <div className="w-16 h-16 bg-emerald-glow rounded-2xl flex items-center justify-center mb-6 shadow-emerald group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔖</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                Smart Bookmarks
              </h3>
              <p className="text-white/60">
                Save your reading progress and create bookmarks to quickly
                return to your favorite verses.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-golden hover:-translate-y-2">
              <div className="w-16 h-16 bg-golden rounded-2xl flex items-center justify-center mb-6 shadow-golden group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌙</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                Dark Mode
              </h3>
              <p className="text-white/60">
                Comfortable reading in any lighting with automatic dark mode
                that&apos;s easy on the eyes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="bg-glass-light backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-5xl mx-auto shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-quran-gradient mb-2">
                  114
                </div>
                <div className="text-white/60 font-medium">Surahs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-quran-gradient mb-2">
                  6,236
                </div>
                <div className="text-white/60 font-medium">Verses</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-quran-gradient mb-2">
                  30
                </div>
                <div className="text-white/60 font-medium">Juz</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-quran-gradient mb-2">
                  ∞
                </div>
                <div className="text-white/60 font-medium">Blessings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-glass-light backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-emerald-glow rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-emerald">
                <span className="text-4xl">☪️</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                About Al-Quran
              </h2>
            </div>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                The Noble Quran is the central religious text of Islam, believed
                to be a revelation from Allah (God) to Prophet Muhammad (peace
                be upon him). It consists of 114 chapters (Surahs) containing
                6,236 verses (Ayahs).
              </p>
              <p>
                This application provides a modern, accessible way to read,
                listen to, and understand the Quran. Whether you&apos;re a student of
                knowledge, seeking spiritual guidance, or simply exploring,
                we&apos;ve designed this platform to make your journey meaningful and
                enriching.
              </p>
              <p className="text-emerald-bright font-semibold text-center text-lg pt-4">
                &quot;Indeed, this Quran guides to that which is most suitable.&quot;
                <br />
                <span className="text-white/60 text-sm">(Quran 17:9)</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Begin Your Journey Today
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Start reading the Quran with our beautiful, feature-rich platform
            designed for modern Muslims.
          </p>
          <Link
            href="/quran"
            className="inline-block bg-emerald-glow hover:bg-emerald-glow text-white px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-emerald hover:shadow-emerald hover:scale-105"
          >
            Open Al-Quran →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="container mx-auto text-center text-white/50 text-sm">
          <p>© 2025 Al-Quran App. Made with ❤️ for the Muslim Ummah.</p>
          <p className="mt-2">
            May Allah accept this effort and make it beneficial for all.
          </p>
        </div>
      </footer>
    </div>
  );
}
