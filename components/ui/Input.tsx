import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-white text-stone-900',
            'placeholder:text-stone-400 text-base',
            'transition-all duration-200 outline-none',
            'focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-red-400 focus:ring-red-300 focus:border-red-400'
              : 'border-stone-200 focus:ring-amber-400 focus:border-amber-400',
            className,
          )}
          {...props}
        />
        {error && (
          <p role="alert" className="mt-1.5 text-xs text-red-500 font-medium">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-stone-400">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
