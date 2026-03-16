"use client";

import { usePromotionStore } from "@/src/presentation/stores/promotionStore";
import { cn } from "@/src/presentation/utils/style";
import { ExternalLink, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const PROMOTION_ID = "portfolio_showcase";
const DISMISS_DURATION_DAYS = 7;

export function PortfolioShowcase() {
  const { isPromotionDismissed, dismissPromotion } = usePromotionStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Delay visibility to not annoy user immediately (3 seconds)
    const timer = setTimeout(() => {
      if (!isPromotionDismissed(PROMOTION_ID, DISMISS_DURATION_DAYS)) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPromotionDismissed]);

  if (!isMounted || !isVisible) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsVisible(false);
    dismissPromotion(PROMOTION_ID);
  };

  return (
    <div 
      className={cn(
        "fixed z-50 animate-in fade-in slide-in-from-bottom-8 duration-500 group",
        "bottom-24 sm:bottom-6 right-4 sm:right-6", 
        "w-[calc(100%-2rem)] sm:w-[380px]"
      )}
    >
      {/* Background with Glassmorphism and Gradient border suitable for Light/Dark Mode */}
      <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-2xl p-4 transition-all duration-500 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] dark:hover:shadow-emerald-500/10">
        
        {/* Decorative Glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-100 dark:bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/20 transition-colors" />
        
        <div className="relative flex items-start gap-4">
          {/* Icon Area */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
            <Sparkles className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="flex-grow pr-6">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
              อยากได้แอปสวยๆ แบบนี้ไหม?
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              สำรวจผลงานคุณภาพจากทีมผู้พัฒนา เพื่อช่วยยกระดับธุรกิจและไอเดียของคุณให้เป็นจริง
            </p>
            
            <a 
              href="https://cleancode1986-portfolio.vercel.app/portfolio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-emerald-700 dark:text-emerald-400 hover:text-white rounded-lg text-xs font-bold transition-all duration-300 border border-emerald-200 dark:border-emerald-500/20"
            >
              คลิกดูผลงานทั้งหมด
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Close Button */}
          <button 
            onClick={handleDismiss}
            className="absolute -top-1 -right-1 p-2 text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="ซ่อนการแจ้งเตือน (7 วัน)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
