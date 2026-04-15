'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useGifts } from '@/hooks/useGifts';
import { TOTAL_GIFTS } from '@/lib/constants';
import { formatCurrency, parseCurrencyInput } from '@/utils/currency';
import { formatDate } from '@/utils/date';

/**
 * Incremental setup form: the user adds gifts one by one up to TOTAL_GIFTS.
 */
export function SetupForm() {
  const { gifts, addGift, canAddMore } = useGifts();

  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');

  const totalBudget = useMemo(
    () => gifts.reduce((acc, gift) => acc + gift.budget, 0),
    [gifts],
  );

  const handleAddGift = () => {
    const parsedBudget = parseCurrencyInput(budget);
    const result = addGift({
      title,
      budget: Number.isNaN(parsedBudget) ? -1 : parsedBudget,
    });

    if (!result.ok) {
      setError(result.error ?? 'No se pudo agregar el regalo');
      return;
    }

    setError('');
    setTitle('');
    setBudget('');
  };

  return (
    <div className="w-full space-y-5">
      <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-4">
        <Input
          label="Regalo"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          placeholder="Ej: Audifonos para mis sesiones"
          maxLength={80}
        />

        <Input
          label="Presupuesto"
          type="text"
          inputMode="decimal"
          value={budget}
          onChange={(e) => {
            setBudget(e.target.value);
            if (error) setError('');
          }}
          onBlur={() => {
            if (!budget.trim()) return;
            const parsed = parseCurrencyInput(budget);
            if (Number.isFinite(parsed) && parsed >= 0) {
              setBudget(formatCurrency(parsed));
            }
          }}
          placeholder="Ej: $500.00"
          hint="Cada regalo obtiene fecha automatica desde la proxima semana"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          onClick={handleAddGift}
          className="w-full"
          size="lg"
          disabled={!canAddMore}
        >
          {canAddMore ? 'Agregar regalo' : 'Limite alcanzado'}
        </Button>
      </div>

      <div className="flex items-center justify-between text-sm bg-stone-100 rounded-xl px-4 py-2">
        <p className="font-medium text-stone-600">
          {gifts.length}/{TOTAL_GIFTS} regalos
        </p>
        <p className="font-semibold text-stone-700">Presupuesto total: {formatCurrency(totalBudget)}</p>
      </div>

      <div className="space-y-2">
        {gifts.length === 0 && (
          <p className="text-sm text-stone-400 text-center py-4">
            Empieza agregando tu primer regalo.
          </p>
        )}

        {gifts.map((gift, index) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-stone-200 rounded-xl px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-stone-400">Regalo #{index + 1}</p>
                <p className="font-semibold text-stone-900">{gift.title}</p>
                <p className="text-sm text-stone-500">Disponible: {formatDate(gift.date)}</p>
              </div>
              <span className="text-sm font-semibold text-stone-700">{formatCurrency(gift.budget)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
