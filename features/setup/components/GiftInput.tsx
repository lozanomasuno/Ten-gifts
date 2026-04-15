'use client';

import { Input } from '@/components/ui/Input';

interface GiftInputProps {
  index: number;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

/** A numbered single-gift input row used inside the SetupForm. */
export function GiftInput({ index, value, error, onChange }: GiftInputProps) {
  return (
    <div className="flex items-start gap-3">
      {/* Number badge */}
      <div
        aria-hidden
        className="flex-shrink-0 w-8 h-8 mt-3 rounded-full bg-amber-100 text-amber-700 font-bold text-sm flex items-center justify-center select-none"
      >
        {index + 1}
      </div>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Regalo ${index + 1}…`}
        error={error}
        maxLength={80}
        aria-label={`Regalo número ${index + 1}`}
      />
    </div>
  );
}
