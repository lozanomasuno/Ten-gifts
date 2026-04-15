'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useGifts } from '@/hooks/useGifts';
import { MOTIVATIONAL_MESSAGES, TOTAL_GIFTS } from '@/lib/constants';
import { ProgressBar } from './ProgressBar';

export function GiftBox() {
  const router = useRouter();
  const {
    gifts,
    openedCount,
    availableCount,
    totalGifts,
    isAllOpened,
    selectRandomAvailableGift,
    refreshStatuses,
    resetStore,
  } = useGifts();

  const [loadingSelection, setLoadingSelection] = useState(false);
  const [feedback, setFeedback] = useState('');

  const shuffledGifts = useMemo(() => {
    const copied = [...gifts];
    for (let i = copied.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    return copied;
  }, [gifts]);

  const handleOpenRandom = async () => {
    setLoadingSelection(true);
    refreshStatuses();

    await new Promise<void>((resolve) => setTimeout(resolve, 900));

    const selected = selectRandomAvailableGift();
    if (!selected) {
      setFeedback('Aun no tienes regalos listos para hoy. Confia en el proceso.');
      setLoadingSelection(false);
      return;
    }

    setFeedback('Hoy es tu dia. Tu regalo ha sido elegido.');
    setLoadingSelection(false);
    router.push('/result');
  };

  const handleReset = () => {
    const confirmed = globalThis.confirm(
      'Se eliminaran todos tus regalos guardados y el progreso actual. Esta accion no se puede deshacer.',
    );

    if (!confirmed) return;

    resetStore();
    router.push('/setup');
  };

  if (gifts.length === 0) {
    return (
      <div className="max-w-sm mx-auto text-center space-y-4">
        <p className="text-stone-500">Aun no hay regalos configurados.</p>
        <Button className="w-full" onClick={() => router.push('/setup')}>
          Ir a configuracion
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <ProgressBar used={openedCount} total={TOTAL_GIFTS} />

      <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
        <h2 className="text-lg font-semibold text-stone-900">Tu lista de regalos</h2>
        <p className="text-sm text-stone-500">Completados {openedCount}/{totalGifts}</p>

        <div className="space-y-2">
          {shuffledGifts.map((gift, index) => {
            const realIndex = gifts.findIndex((item) => item.id === gift.id) + 1;
            return (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={
                  gift.status === 'opened'
                    ? 'rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-lime-50 to-stone-50 px-4 py-4'
                    : 'rounded-xl border border-stone-300 bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300 px-4 py-4'
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    {gift.status === 'opened' ? (
                      <>
                        <p className="text-sm text-emerald-700">Regalo #{realIndex}</p>
                        <p className="font-semibold text-stone-900 break-words">{gift.title}</p>
                        <p className="text-xs text-emerald-700">Orden {gift.openedOrder}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-stone-500">Carta {index + 1}</p>
                        <p className="font-semibold tracking-widest text-stone-600">✿ ✿ ✿</p>
                      </>
                    )}
                  </div>

                  {gift.status === 'opened' ? (
                    <span className="text-xs px-2 py-1 rounded-full font-semibold bg-green-100 text-green-700">
                      Revelada
                    </span>
                  ) : (
                    <span className="text-lg text-stone-500" aria-hidden>
                      ✿
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleOpenRandom}
          loading={loadingSelection}
          disabled={loadingSelection || availableCount === 0 || isAllOpened}
          className="w-full"
          size="lg"
        >
          Abrir regalo aleatorio
        </Button>

        <p className="text-center text-sm text-stone-500">
          {feedback || MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]}
        </p>

        <Button variant="ghost" className="w-full" onClick={() => router.push('/setup')}>
          Agregar mas regalos
        </Button>

        <div className="pt-2 border-t border-stone-200">
          <Button variant="danger" className="w-full" onClick={handleReset}>
            Reiniciar datos
          </Button>
          <p className="mt-2 text-center text-xs text-stone-400">
            Borra regalos, progreso y seleccion actual almacenados en este dispositivo.
          </p>
        </div>
      </div>
    </div>
  );
}
