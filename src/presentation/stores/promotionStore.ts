import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PromotionState {
  dismissedPromotions: Record<string, number>; // promotionId -> timestamp
  dismissPromotion: (id: string) => void;
  isPromotionDismissed: (id: string, durationDays: number) => boolean;
}

export const usePromotionStore = create<PromotionState>()(
  persist(
    (set, get) => ({
      dismissedPromotions: {},
      dismissPromotion: (id: string) =>
        set((state) => ({
          dismissedPromotions: {
            ...state.dismissedPromotions,
            [id]: Date.now(),
          },
        })),
      isPromotionDismissed: (id: string, durationDays: number) => {
        const dismissedAt = get().dismissedPromotions[id];
        if (!dismissedAt) return false;

        const msPerDay = 24 * 60 * 60 * 1000;
        const daysSinceDismissed = (Date.now() - dismissedAt) / msPerDay;
        return daysSinceDismissed < durationDays;
      },
    }),
    {
      name: 'quran-promotion-storage',
    }
  )
);
