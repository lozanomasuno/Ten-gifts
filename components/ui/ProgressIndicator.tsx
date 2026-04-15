interface ProgressIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

/** Dot-based progress indicator showing how many gifts have been used. */
export function ProgressIndicator({
  current,
  total,
  className,
}: ProgressIndicatorProps) {
  return (
    <div
      className={`flex items-center gap-3 ${className ?? ''}`}
      aria-label={`${current} de ${total} regalos completados`}
    >
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i < current ? 'bg-amber-500 scale-100' : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-stone-600 tabular-nums">
        {current}/{total}
      </span>
    </div>
  );
}
