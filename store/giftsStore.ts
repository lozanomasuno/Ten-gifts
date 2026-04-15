import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Gift, GiftStore } from '@/types';
import { STORAGE_KEY, TOTAL_GIFTS } from '@/lib/constants';
import {
  getGiftDateByIndex,
  getStatusFromDate,
  isValidDateInput,
  toISODate,
} from '@/utils/date';
import { pickRandomItem } from '@/utils/random';

const initialState = {
  gifts: [] as Gift[],
  currentGift: null as Gift | null,
  _hasHydrated: false,
};

function normalizeGift(rawGift: any, index: number, fallbackBudget = 0): Gift {
  const id = typeof rawGift?.id === 'string' && rawGift.id ? rawGift.id : `gift-migrated-${index}-${Date.now()}`;
  const titleFromLegacy = typeof rawGift?.name === 'string' ? rawGift.name : '';
  const title = typeof rawGift?.title === 'string' && rawGift.title.trim()
    ? rawGift.title.trim()
    : titleFromLegacy.trim() || `Regalo ${index + 1}`;

  const budget = typeof rawGift?.budget === 'number' && Number.isFinite(rawGift.budget)
    ? rawGift.budget
    : fallbackBudget;

  const candidateDate = typeof rawGift?.date === 'string' ? rawGift.date : '';
  const date = isValidDateInput(candidateDate)
    ? candidateDate
    : toISODate(getGiftDateByIndex(new Date(), index));

  const wasUsed = rawGift?.used === true || rawGift?.status === 'opened';
  const status = getStatusFromDate(date, wasUsed);
  const openedOrder =
    typeof rawGift?.openedOrder === 'number' && Number.isFinite(rawGift.openedOrder) && rawGift.openedOrder > 0
      ? rawGift.openedOrder
      : null;

  return {
    id,
    title,
    budget,
    date,
    status,
    openedOrder,
  };
}

/**
 * Central Zustand store.
 * Persisted to localStorage via the `persist` middleware so the state
 * survives page reloads without a backend.
 *
 * Why Zustand over Context API?
 * - Built-in persist middleware avoids manual localStorage glue code.
 * - Selector-based subscriptions prevent unnecessary re-renders.
 * - Trivial to swap persistence adapter for a real backend later.
 */
export const useGiftStore = create<GiftStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ── Actions ───────────────────────────────────────────────────────

      addGift: ({ title, budget }) => {
        const { gifts } = get();
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
          return { ok: false, error: 'El titulo es obligatorio' };
        }
        if (Number.isNaN(budget) || budget < 0) {
          return { ok: false, error: 'El presupuesto debe ser valido' };
        }
        if (gifts.length >= TOTAL_GIFTS) {
          return { ok: false, error: `Solo puedes agregar ${TOTAL_GIFTS} regalos` };
        }
        const exists = gifts.some(
          (gift) => gift.title.toLowerCase() === trimmedTitle.toLowerCase(),
        );
        if (exists) {
          return { ok: false, error: 'Ese regalo ya existe en tu lista' };
        }

        const date = toISODate(getGiftDateByIndex(new Date(), gifts.length));
        const newGift: Gift = {
          id: `gift-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title: trimmedTitle,
          budget,
          date,
          status: getStatusFromDate(date, false),
          openedOrder: null,
        };

        set({ gifts: [...gifts, newGift] });
        return { ok: true };
      },

      selectRandomAvailableGift: () => {
        get().refreshStatuses();
        const { gifts } = get();
        const available = gifts.filter((g) => g.status === 'available');
        const selected = pickRandomItem(available);
        if (!selected) return null;
        set({ currentGift: selected });
        return selected;
      },

      confirmCurrentGift: () => {
        const { gifts, currentGift } = get();
        if (!currentGift) return;
        const nextOpenedOrder = gifts.reduce((maxOrder, gift) => {
          const currentOrder = gift.openedOrder ?? 0;
          return Math.max(maxOrder, currentOrder);
        }, 0) + 1;

        const updatedGifts: Gift[] = gifts.map((g) =>
          g.id === currentGift.id
            ? { ...g, status: 'opened', openedOrder: nextOpenedOrder }
            : g,
        );
        set({ gifts: updatedGifts, currentGift: null });
      },

      refreshStatuses: () => {
        const now = new Date();
        const refreshed: Gift[] = get().gifts.map((gift) => {
          const isOpened = gift.status === 'opened';
          return {
            ...gift,
            status: getStatusFromDate(gift.date, isOpened, now),
          };
        });
        set({ gifts: refreshed });
      },

      resetStore: () => set(initialState),

      setHasHydrated: (value: boolean) => set({ _hasHydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      version: 3,
      migrate: (persistedState: any) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return initialState;
        }

        const fallbackBudget =
          typeof persistedState.budget === 'number' && Number.isFinite(persistedState.budget)
            ? persistedState.budget
            : 0;

        const rawGifts: any[] = Array.isArray(persistedState.gifts)
          ? persistedState.gifts
          : [];
        const gifts = rawGifts
          .slice(0, TOTAL_GIFTS)
          .map((gift: any, index: number) => normalizeGift(gift, index, fallbackBudget));

        let nextFallbackOpenedOrder = gifts.reduce((maxOrder, gift) => {
          const currentOrder = gift.openedOrder ?? 0;
          return Math.max(maxOrder, currentOrder);
        }, 0) + 1;

        const giftsWithOpenedOrder = gifts.map((gift) => {
          if (gift.status !== 'opened' || gift.openedOrder !== null) {
            return gift;
          }

          const backfilledGift = {
            ...gift,
            openedOrder: nextFallbackOpenedOrder,
          };
          nextFallbackOpenedOrder += 1;
          return backfilledGift;
        });

        const rawCurrentGift = persistedState.currentGift;
        const normalizedCurrentGift = rawCurrentGift
          ? normalizeGift(rawCurrentGift, 0, fallbackBudget)
          : null;

        return {
          ...initialState,
          gifts: giftsWithOpenedOrder,
          currentGift: normalizedCurrentGift,
        };
      },
      partialize: (state) => ({
        gifts: state.gifts,
        currentGift: state.currentGift,
      }),
      // Notify the store once localStorage data has been loaded into state.
      // This lets components avoid rendering stale (pre-hydration) values.
      onRehydrateStorage: () => (state) => {
        state?.refreshStatuses();
        state?.setHasHydrated(true);
      },
    },
  ),
);
