import type { GiftStatus } from '@/types';

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Starts from next Sunday (or next week boundary) and assigns consecutive days.
export function getGiftDateByIndex(baseDate: Date, index: number) {
  const today = startOfDay(baseDate);
  const next = new Date(today);
  const day = today.getDay();
  const daysUntilNextWeek = day === 0 ? 7 : 7 - day;
  next.setDate(today.getDate() + daysUntilNextWeek + index);
  return next;
}

export function toISODate(date: Date) {
  return date.toISOString().split('T')[0];
}

export function isValidDateInput(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime());
}

export function getStatusFromDate(dateISO: string, isOpened: boolean, now = new Date()): GiftStatus {
  void dateISO;
  void now;
  if (isOpened) return 'opened';
  // Date is still stored for display purposes, but it no longer blocks claiming.
  return 'available';
}

export function daysUntil(dateISO: string, now = new Date()) {
  if (!isValidDateInput(dateISO)) return 0;
  const giftDate = startOfDay(new Date(dateISO)).getTime();
  const today = startOfDay(now).getTime();
  const delta = Math.ceil((giftDate - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, delta);
}

export function formatDate(dateISO: string, locale = 'es-MX') {
  if (!isValidDateInput(dateISO)) {
    return 'Fecha pendiente';
  }
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
