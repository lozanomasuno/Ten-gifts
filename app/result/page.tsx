'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GiftResult } from '@/features/result/components/GiftResult';
import { useGifts } from '@/hooks/useGifts';

/**
 * Result page — shows the randomly selected gift and requires
 * an irreversible confirmation before returning to /box.
 *
 * Navigation guards:
 *  - No setup → /setup
 *  - No gift selected → /box  (handles back-button or direct navigation)
 */
export default function ResultPage() {
  const router = useRouter();
  const { hasAnyGift, currentGift } = useGifts();

  useEffect(() => {
    if (!hasAnyGift) {
      router.replace('/setup');
    } else if (!currentGift) {
      router.replace('/box');
    }
  }, [hasAnyGift, currentGift, router]);

  if (!hasAnyGift || !currentGift) return null;

  return (
    <PageWrapper>
      <GiftResult />
    </PageWrapper>
  );
}
