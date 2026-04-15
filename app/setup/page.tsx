'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SetupForm } from '@/features/setup/components/SetupForm';
import { Button } from '@/components/ui/Button';
import { useGifts } from '@/hooks/useGifts';
import { APP_NAME } from '@/lib/constants';

/**
 * Setup page — where users define their 10 gifts and optional budget.
 */
export default function SetupPage() {
  const router = useRouter();
  const { gifts, resetStore } = useGifts();

  const handleReset = () => {
    const confirmed = window.confirm(
      'Se eliminaran todos tus regalos guardados y el progreso actual. Esta accion no se puede deshacer.',
    );

    if (!confirmed) return;

    resetStore();
  };

  return (
    <PageWrapper>
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">
            {APP_NAME}
          </h1>
          <p className="text-stone-500 mt-2 text-sm leading-relaxed max-w-xs mx-auto">
            Agrega regalos personales y liberalos solo cuando llegue su fecha.
          </p>
        </motion.div>

        {gifts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 space-y-3"
          >
            <Button variant="secondary" className="w-full" onClick={() => router.push('/box')}>
              Ver mis regalos ({gifts.length})
            </Button>
            <Button variant="danger" className="w-full" onClick={handleReset}>
              Reiniciar datos
            </Button>
          </motion.div>
        )}

        {/* Form */}
        <SetupForm />
      </div>
    </PageWrapper>
  );
}
