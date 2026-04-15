interface ProgressBarProps {
  used: number;
  total: number;
}

/** Horizontal progress bar showing how many gifts have been opened. */
export function ProgressBar({ used, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={used}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${used} de ${total} regalos completados`}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
          Progreso
        </span>
        <span className="text-xs font-semibold text-stone-600 tabular-nums">
          {used}/{total} regalos
        </span>
      </div>
      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
