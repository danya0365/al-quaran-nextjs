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
                ฟีเจอร์
              </a>
              <a
                href="#about"
                className="text-white/80 hover:text-white transition-colors"
              >
                เกี่ยวกับ
              </a>
              <a
                href="#stats"
                className="text-white/80 hover:text-white transition-colors"
              >
                สถิติ
              </a>
              <Link
                href="/home"
                className="bg-emerald-glow hover:bg-emerald-glow text-white px-6 py-2 rounded-lg font-medium transition-all shadow-emerald hover:shadow-emerald hover:scale-105"
              >
                เริ่มอ่าน
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
                ประสบการณ์อ่านอัลกุรอานสมัยใหม่
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              อ่านและเข้าใจ
              <br />
              <span className="text-quran-gradient">อัลกุรอานอันทรงเกียรติ</span>
            </h2>

            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              สัมผัสพระดำรัสด้วยอักษรอาหรับที่งดงาม คำแปล เสียงตะลาเวฮ์ และเครื่องมือศึกษาที่ทรงพลัง
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/home"
                className="bg-emerald-glow hover:bg-emerald-glow text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-emerald hover:shadow-emerald hover:scale-105 w-full sm:w-auto text-center"
              >
                เริ่มอ่านตอนนี้ →
              </Link>
              <a
                href="#features"
                className="bg-glass-light hover:bg-glass-light text-white px-8 py-4 rounded-xl font-semibold transition-all border border-white/20 backdrop-blur-xl w-full sm:w-auto text-center"
              >
                สำรวจฟีเจอร์
              </a>
            </div>

            {/* Floating Cards Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-glass-light transition-all shadow-lg hover:shadow-emerald hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-glow rounded-xl flex items-center justify-center mb-4 mx-auto shadow-emerald">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  114 ซูเราะฮ์
                </h3>
                <p className="text-white/60 text-sm">
                  อัลกุรอานครบทุกบท
                </p>
              </div>

              <div className="bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-glass-light transition-all shadow-lg hover:shadow-golden hover:-translate-y-1">
                <div className="w-12 h-12 bg-golden rounded-xl flex items-center justify-center mb-4 mx-auto shadow-golden">
                  <span className="text-2xl">🎧</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  เสียงตะลาเวฮ์
                </h3>
                <p className="text-white/60 text-sm">
                  ฟังจากกอรีหลายท่าน
                </p>
              </div>

              <div className="bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-glass-light transition-all shadow-lg hover:shadow-emerald hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-glow rounded-xl flex items-center justify-center mb-4 mx-auto shadow-emerald">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  คำแปลหลายภาษา
                </h3>
                <p className="text-white/60 text-sm">
                  อ่านได้หลายภาษา
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
              ฟีเจอร์ทรงพลัง
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              ทุกสิ่งที่คุณต้องการเพื่อประสบการณ์อ่านอัลกุรอานที่ลึกซึ้งและมีความหมาย
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-emerald hover:-translate-y-2">
              <div className="w-16 h-16 bg-emerald-glow rounded-2xl flex items-center justify-center mb-6 shadow-emerald group-hover:scale-110 transition-transform">
                <span className="text-3xl">📖</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                ตัวอักษรงดงาม
              </h3>
              <p className="text-white/60">
                อ่านด้วยฟอนต์อาหรับที่สวยงาม ปรับขนาดตัวอักษรได้ พร้อมไฮไลต์ตัจวีดเพื่อการออกเสียงที่ถูกต้อง
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-golden hover:-translate-y-2">
              <div className="w-16 h-16 bg-golden rounded-2xl flex items-center justify-center mb-6 shadow-golden group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎵</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                เสียงตะลาเวฮ์
              </h3>
              <p className="text-white/60">
                ฟังการตะลาเวฮ์อันไพเราะจากกอรีชื่อดัง ดาวน์โหลดไว้ฟังแบบออฟไลน์ได้ทุกที่ทุกเวลา
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-emerald hover:-translate-y-2">
              <div className="w-16 h-16 bg-emerald-glow rounded-2xl flex items-center justify-center mb-6 shadow-emerald group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                รองรับหลายภาษา
              </h3>
              <p className="text-white/60">
                เข้าถึงคำแปลได้หลายภาษาเพื่อความเข้าใจความหมายของอายะห์อย่างชัดเจน
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-golden hover:-translate-y-2">
              <div className="w-16 h-16 bg-golden rounded-2xl flex items-center justify-center mb-6 shadow-golden group-hover:scale-110 transition-transform">
                <span className="text-3xl">💾</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                อ่านออฟไลน์
              </h3>
              <p className="text-white/60">
                ดาวน์โหลดซูเราะฮ์และอ่านโดยไม่ใช้อินเทอร์เน็ต เหมาะสำหรับการเดินทางและพื้นที่ที่อินเทอร์เน็ตจำกัด
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-emerald hover:-translate-y-2">
              <div className="w-16 h-16 bg-emerald-glow rounded-2xl flex items-center justify-center mb-6 shadow-emerald group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔖</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                ที่คั่นอัจฉริยะ
              </h3>
              <p className="text-white/60">
                บันทึกความคืบหน้าและสร้างที่คั่น เพื่อกลับไปยังอายะห์ที่ชื่นชอบได้อย่างรวดเร็ว
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-glass-light transition-all shadow-lg hover:shadow-golden hover:-translate-y-2">
              <div className="w-16 h-16 bg-golden rounded-2xl flex items-center justify-center mb-6 shadow-golden group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌙</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                โหมดมืด
              </h3>
              <p className="text-white/60">
                อ่านสบายตาในทุกสภาพแสงด้วยโหมดมืดอัตโนมัติที่อ่อนโยนต่อสายตา
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
                <div className="text-white/60 font-medium">ซูเราะฮ์</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-quran-gradient mb-2">
                  6,236
                </div>
                <div className="text-white/60 font-medium">อายะห์</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-quran-gradient mb-2">
                  30
                </div>
                <div className="text-white/60 font-medium">ญุซ</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-quran-gradient mb-2">
                  ∞
                </div>
                <div className="text-white/60 font-medium">พรอันประเสริฐ</div>
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
                เกี่ยวกับอัลกุรอาน
              </h2>
            </div>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                อัลกุรอานอันทรงเกียรติคือคัมภีร์หลักของศาสนาอิสลาม เชื่อกันว่าเป็นโองการจากอัลลอฮ์ (พระเจ้า) ที่ประทานแก่ท่านนบีมุฮัมมัด ﷺ ประกอบด้วย 114 ซูเราะฮ์ รวมทั้งหมด 6,236 อายะห์
              </p>
              <p>
                แอปนี้มอบวิธีการอ่าน ฟัง และทำความเข้าใจอัลกุรอานในรูปแบบสมัยใหม่และเข้าถึงง่าย ไม่ว่าคุณจะเป็นผู้ศึกษาหาความรู้ ผู้แสวงหาคำแนะนำทางจิตวิญญาณ หรือผู้เริ่มต้น เราออกแบบแพลตฟอร์มนี้เพื่อให้การเดินทางของคุณมีความหมายและเกื้อกูล
              </p>
              <p className="text-emerald-bright font-semibold text-center text-lg pt-4">
                &quot;แท้จริงแล้ว อัลกุรอานนี้ชี้นำไปสู่สิ่งที่เที่ยงตรงที่สุด&quot;
                <br />
                <span className="text-white/60 text-sm">(อัลอิสรออ์ 17:9)</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            เริ่มต้นการเดินทางของคุณวันนี้
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            เริ่มอ่านอัลกุรอานด้วยแพลตฟอร์มที่สวยงามและอัดแน่นด้วยฟีเจอร์ ออกแบบมาสำหรับมุสลิมยุคใหม่
          </p>
          <Link
            href="/home"
            className="inline-block bg-emerald-glow hover:bg-emerald-glow text-white px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-emerald hover:shadow-emerald hover:scale-105"
          >
            เปิดอัลกุรอาน →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="container mx-auto text-center text-white/50 text-sm">
          <p>© 2025 Al-Quran App. สร้างด้วย ❤️ เพื่อประชาชาติของมุสลิม</p>
          <p className="mt-2">ขออัลลอฮ์ทรงตอบรับและให้เกิดประโยชน์แก่ทุกคน</p>
        </div>
      </footer>
    </div>
  );
}
