/**
 * High Precision Numerical Utility & Display Formatter
 * Eliminates floating point artifacts (e.g., 0.1 + 0.2 -> 0.3)
 */

export function cleanFloat(val: number, precision: number = 14): number {
  if (!Number.isFinite(val)) return val;
  // Convert to scientific notation with limited precision then back to number
  const str = val.toPrecision(precision);
  return parseFloat(str);
}

export function formatResultNumber(
  val: number,
  mode: 'standard' | 'scientific' | 'engineering' = 'standard',
  maxDecimals: number = 10
): string {
  if (Number.isNaN(val)) return 'NaN';
  if (!Number.isFinite(val)) return val > 0 ? '∞' : '-∞';

  const cleaned = cleanFloat(val);

  // Very large or very small numbers default to scientific if standard would be awkward
  const abs = Math.abs(cleaned);
  if (mode === 'standard') {
    if (abs !== 0 && (abs >= 1e14 || abs <= 1e-7)) {
      return cleaned.toExponential(6).replace('e+', 'e');
    }
    // Standard localized or rounded display
    const parts = cleaned.toString().split('.');
    if (parts.length === 1) return parts[0];
    const dec = parts[1].slice(0, maxDecimals);
    return dec.length > 0 ? `${parts[0]}.${dec}` : parts[0];
  }

  if (mode === 'scientific') {
    return cleaned.toExponential(6).replace('e+', 'e');
  }

  if (mode === 'engineering') {
    if (cleaned === 0) return '0';
    const exp = Math.floor(Math.log10(abs));
    const engExp = Math.floor(exp / 3) * 3;
    const mantissa = cleaned / Math.pow(10, engExp);
    const roundedMantissa = cleanFloat(mantissa, 6);
    return engExp === 0 ? `${roundedMantissa}` : `${roundedMantissa}e${engExp > 0 ? '+' : ''}${engExp}`;
  }

  return cleaned.toString();
}

/**
 * Counts significant figures in a numeric string
 */
export function getSignificantFigures(numStr: string): number {
  const sanitized = numStr.replace('-', '').trim();
  if (!sanitized || sanitized === '0') return 1;

  if (sanitized.includes('e') || sanitized.includes('E')) {
    const mantissa = sanitized.split(/[eE]/)[0].replace('.', '');
    return mantissa.replace(/^0+/, '').length;
  }

  if (sanitized.includes('.')) {
    const withoutDot = sanitized.replace('.', '').replace(/^0+/, '');
    return withoutDot.length;
  }

  // Trailing zeros in integer without decimal
  const trimmedZeros = sanitized.replace(/0+$/, '');
  return trimmedZeros.length;
}
