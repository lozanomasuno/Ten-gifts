'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGifts } from '@/hooks/useGifts';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

/**
 * Displays the currently selected gift and requires an irreversible
 * confirmation before marking it as used and returning to /box.
 */
export function GiftResult() {
  const router = useRouter();
  const { currentGift, confirmCurrentGift, openedCount, totalGifts } = useGifts();
  const [confirmed, setConfirmed] = useState(false);

  // Guard: page handles the redirect if currentGift is null
  if (!currentGift) return null;

  const handleConfirm = () => {
    setConfirmed(true);
    confirmCurrentGift();
    setTimeout(() => router.push('/box'), 1600);
  };

  return (
    <div className="w-full max-w-sm space-y-6 text-center">
      {/* Gift reveal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, type: 'spring', bounce: 0.38 }}
        className="bg-white rounded-3xl shadow-lg border border-stone-100 px-8 py-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.25, type: 'spring', bounce: 0.5 }}
          className="text-6xl mb-5 select-none"
        >
          🎁
        </motion.div>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
          Tu siguiente regalo es
        </p>
        <h2 className="text-2xl font-bold text-stone-900 leading-snug break-words">
          {currentGift.title}
        </h2>
        <p className="text-sm text-stone-600 mt-2">Presupuesto: {formatCurrency(currentGift.budget)}</p>
        <p className="text-xs text-stone-500 mt-1">Fecha asignada: {formatDate(currentGift.date)}</p>
        <p className="text-xs text-stone-400 mt-4 tabular-nums">
          Progreso {openedCount + 1} de {totalGifts}
        </p>
      </motion.div>

      {/* Irreversibility warning */}
      {!confirmed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-left"
        >
          <p className="text-xs text-amber-700 leading-relaxed">
            ⚠️{' '}
            <strong className="font-semibold">Esta decisión es irreversible.</strong>{' '}
            Una vez que confirmes, este regalo quedará marcado como completado y
            no podrás volver atrás.
          </p>
        </motion.div>
      )}

      {/* Action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        {confirmed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-2"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className="text-4xl select-none"
            >
              ✅
            </motion.span>
            <p className="text-green-600 font-semibold text-sm">
              ¡Confirmado! Volviendo a tu caja…
            </p>
          </motion.div>
        ) : (
          <Button onClick={handleConfirm} size="lg" className="w-full">
            Aceptar regalo (no se puede cambiar)
          </Button>
        )}
      </motion.div>
    </div>
  );
}
