'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGiftStore } from '@/store/giftsStore';

/**
 * Root page: reads the persisted setup state and immediately redirects
 * to the appropriate screen. The user never sees this page directly.
 */
export default function HomePage() {
  const router = useRouter();
  const hasAnyGift = useGiftStore((s) => s.gifts.length > 0);

  useEffect(() => {
    router.replace(hasAnyGift ? '/box' : '/setup');
  }, [hasAnyGift, router]);

  return null;
}
