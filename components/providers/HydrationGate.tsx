'use client';

import { type ReactNode } from 'react';
import { useGiftStore } from '@/store/giftsStore';

interface HydrationGateProps {
  children: ReactNode;
}

/**
 * Blocks rendering until Zustand has rehydrated from localStorage.
 * This prevents a flash of incorrect content (e.g. the setup form
 * appearing briefly for a user who has already configured their gifts).
 */
export function HydrationGate({ children }: HydrationGateProps) {
  const hasHydrated = useGiftStore((s) => s._hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-stone-400 text-sm animate-pulse">Cargando…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
