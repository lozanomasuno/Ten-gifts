'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps every page with a consistent animated entry transition,
 * background colour, and centred flex layout.
 */
export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 ${className ?? ''}`}
    >
      {children}
    </motion.main>
  );
}
