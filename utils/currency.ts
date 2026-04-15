const DEFAULT_LOCALE = 'es-MX';
const DEFAULT_CURRENCY = 'MXN';

export function formatCurrency(
  amount: number,
  locale = DEFAULT_LOCALE,
  currency = DEFAULT_CURRENCY,
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseCurrencyInput(value: string) {
  const normalized = value
    .replaceAll(/\s/g, '')
    .replaceAll('$', '')
    .replaceAll(',', '')
    .replaceAll(/[^\d.]/g, '');

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}
