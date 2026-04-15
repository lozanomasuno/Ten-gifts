'use client';

import { useEffect, useMemo } from 'react';
import { useGiftStore } from '@/store/giftsStore';
import { TOTAL_GIFTS } from '@/lib/constants';

/**
 * Custom hook that exposes the gift store plus computed derived values.
 * Components should consume this hook instead of calling useGiftStore directly
 * so that business logic stays out of UI components.
 */
export function useGifts() {
  const gifts = useGiftStore((s) => s.gifts);
  const currentGift = useGiftStore((s) => s.currentGift);
  const _hasHydrated = useGiftStore((s) => s._hasHydrated);

  const addGift = useGiftStore((s) => s.addGift);
  const selectRandomAvailableGift = useGiftStore((s) => s.selectRandomAvailableGift);
  const confirmCurrentGift = useGiftStore((s) => s.confirmCurrentGift);
  const refreshStatuses = useGiftStore((s) => s.refreshStatuses);
  const resetStore = useGiftStore((s) => s.resetStore);

  useEffect(() => {
    refreshStatuses();
    const onFocus = () => refreshStatuses();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshStatuses]);

  // ── Derived values ──────────────────────────────────────────────────

  const openedCount = useMemo(() => gifts.filter((g) => g.status === 'opened').length, [gifts]);

  const availableCount = useMemo(() => gifts.filter((g) => g.status === 'available').length, [gifts]);

  const lockedCount = useMemo(() => gifts.filter((g) => g.status === 'locked').length, [gifts]);

  const hasAnyGift = gifts.length > 0;

  const isAllOpened = gifts.length > 0 && openedCount === gifts.length;

  const canAddMore = gifts.length < TOTAL_GIFTS;

  return {
    // State
    gifts,
    currentGift,
    isHydrated: _hasHydrated,
    // Derived
    openedCount,
    availableCount,
    lockedCount,
    totalGifts: gifts.length,
    isAllOpened,
    hasAnyGift,
    canAddMore,
    // Actions
    addGift,
    selectRandomAvailableGift,
    confirmCurrentGift,
    refreshStatuses,
    resetStore,
  };
}
