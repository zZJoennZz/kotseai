// Type definitions
interface NumberFormatOptions {
  decimals?: number; // Number of decimal places
  minDecimals?: number;
  maxDecimals?: number;
  useGrouping?: boolean;
  zeroDisplay?: string | null;
  negativeDisplay?: 'minus' | 'parentheses';
  compact?: boolean;
  compactThreshold?: number;
  locale?: 'en-PH' | 'fil-PH';
}

// Main formatting function
function formatNumber(amount: number | string | null | undefined, options: NumberFormatOptions = {}): string {
  // Handle null/undefined/NaN
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return options.zeroDisplay ?? '-';
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle zero display
  if (numAmount === 0 && options.zeroDisplay !== undefined) {
    return '0';
  }

  const {
    decimals = 0,
    minDecimals = decimals,
    maxDecimals = decimals,
    useGrouping = true,
    negativeDisplay = 'minus',
    compact = false,
    compactThreshold = 1_000_000,
    locale = 'en-PH',
  } = options;

  // Determine if we should use compact notation
  const useCompact = compact && Math.abs(numAmount) >= compactThreshold;

  const formatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: Math.max(0, minDecimals),
    maximumFractionDigits: Math.max(0, maxDecimals),
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

      // Remove any existing negative formatting
      const cleanFormatted = absFormatted.replace(/^[-(]+/, '').replace(/\)$/, '');
      formatted = `(${cleanFormatted})`;
    } else {
      formatted = new Intl.NumberFormat(locale, formatOptions).format(numAmount);
    }

    return formatted;
  } catch (error) {
    console.error('Error formatting number:', error);
    // Fallback: manual formatting
    const value = numAmount.toFixed(Math.max(0, minDecimals));
    return useGrouping ? addCommasFallback(value) : value;
  }
}

// Fallback function to manually add commas
function addCommasFallback(value: string): string {
  const [integerPart, decimalPart] = value.split('.');
  const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimalPart ? `${withCommas}.${decimalPart}` : withCommas;
}

// Convenience methods
export const number = {
  // Standard number format with commas and 2 decimals
  standard: (amount: number | string | null | undefined) => formatNumber(amount, { decimals: 2 }),

  // Whole number only (no decimals)
  whole: (amount: number | string | null | undefined) => formatNumber(amount, { decimals: 0 }),

  // Compact format (e.g., 1.2M)
  compact: (amount: number | string | null | undefined) => formatNumber(amount, { compact: true }),

  // Accounting format (negative numbers in parentheses)
  accounting: (amount: number | string | null | undefined) => formatNumber(amount, { negativeDisplay: 'parentheses' }),

  // Format with custom options
  withOptions: formatNumber,
};

// Default export
export default formatNumber;
