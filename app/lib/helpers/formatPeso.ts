// Type definitions
interface PesoFormatOptions {
  showCents?: boolean;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  useGrouping?: boolean;
  zeroDisplay?: string | null;
  negativeDisplay?: 'minus' | 'parentheses';
  compact?: boolean;
  compactThreshold?: number;
  locale?: 'en-PH' | 'fil-PH';
}

// Main formatting function
function formatPeso(amount: number | string | null | undefined, options: PesoFormatOptions = {}): string {
  // Handle null/undefined/NaN
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return options.zeroDisplay ?? '-';
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle zero display
  if (numAmount === 0 && options.zeroDisplay !== undefined) {
    return '0.00';
  }

  const {
    showCents = true,
    minFractionDigits = showCents ? 2 : 0,
    maxFractionDigits = showCents ? 2 : 0,
    useGrouping = true,
    negativeDisplay = 'minus',
    compact = false,
    compactThreshold = 1_000_000,
    locale = 'en-PH',
  } = options;

  // Determine if we should use compact notation
  const useCompact = compact && Math.abs(numAmount) >= compactThreshold;

  const formatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'PHP',
    currencyDisplay: 'symbol',
    minimumFractionDigits: Math.max(0, minFractionDigits),
    maximumFractionDigits: Math.max(0, maxFractionDigits),
    useGrouping: useGrouping,
    notation: useCompact ? 'compact' : 'standard',
    compactDisplay: 'short',
  };

  try {
    let formatted: string;

    // Special handling for negative numbers and parentheses
    if (negativeDisplay === 'parentheses' && numAmount < 0) {
      const absAmount = Math.abs(numAmount);
      const absFormatted = new Intl.NumberFormat(locale, formatOptions).format(absAmount);

      if (absFormatted.startsWith('-') || absFormatted.startsWith('(')) {
        formatted = `(${absFormatted.replace(/^[-(]+/, '').replace(/\)$/, '')})`;
      } else {
        formatted = `(${absFormatted})`;
      }
    } else {
      formatted = new Intl.NumberFormat(locale, formatOptions).format(numAmount);
    }

    return formatted;
  } catch (error) {
    console.error('Error formatting peso:', error);
    // Fallback: manual formatting
    const value = numAmount.toFixed(Math.max(0, minFractionDigits));
    return `₱${value}`;
  }
}

// Convenience methods
export const peso = {
  // Standard peso format (with centavos)
  standard: (amount: number | string | null | undefined) => formatPeso(amount, { showCents: true }),

  // Whole peso only (no centavos)
  whole: (amount: number | string | null | undefined) => formatPeso(amount, { showCents: false }),

  // Compact format (e.g., ₱1.2M)
  compact: (amount: number | string | null | undefined) => formatPeso(amount, { compact: true }),

  // Accounting format (negative numbers in parentheses)
  accounting: (amount: number | string | null | undefined) => formatPeso(amount, { negativeDisplay: 'parentheses' }),

  // Format with custom options
  withOptions: formatPeso,
};

// Default export
export default formatPeso;
