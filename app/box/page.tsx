'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GiftBox } from '@/features/box/components/GiftBox';
import { useGifts } from '@/hooks/useGifts';
import { APP_NAME } from '@/lib/constants';

/**
 * Box page — the main interaction screen where users open random gifts.
 * Guards against direct access when setup has not been completed.
 */
export default function BoxPage() {
  const router = useRouter();
  const hasAnyGift = useGifts().hasAnyGift;

  useEffect(() => {
    if (!hasAnyGift) router.replace('/setup');
  }, [hasAnyGift, router]);

  if (!hasAnyGift) return null;

  return (
    <PageWrapper>
      <div className="w-full flex flex-col items-center gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-stone-900">{APP_NAME}</h1>
          <p className="text-stone-400 text-xs mt-1 uppercase tracking-widest font-medium">
            Tu caja de recompensas
          </p>
        </motion.div>

        {/* Main interaction */}
        <GiftBox />
      </div>
    </PageWrapper>
  );
}
