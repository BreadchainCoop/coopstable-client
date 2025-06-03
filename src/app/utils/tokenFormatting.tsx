import { STROOPS_PER_UNIT } from "@/app/constants";
/**
 * Convert stroops (smallest unit) to decimal string
 * @param stroops - Amount in stroops (as string or number)
 * @returns Decimal string representation
 */
export function stroopsToDecimal(stroops: string | number | bigint): string {
  const amount = BigInt(stroops);
  const whole = amount / BigInt(STROOPS_PER_UNIT);
  const fraction = amount % BigInt(STROOPS_PER_UNIT);
  
  if (fraction === BigInt(0)) {
    return whole.toString();
  }
  
  const fractionStr = fraction.toString().padStart(7, '0');
  return `${whole}.${fractionStr}`.replace(/\.?0+$/, '');
}

/**
 * Convert decimal amount to stroops
 * @param decimal - Decimal amount as string
 * @returns Stroops as string
 */
export function decimalToStroops(decimal: string): string {
  const [whole = '0', fraction = ''] = decimal.split('.');
  const paddedFraction = fraction.padEnd(7, '0').slice(0, 7);
  const stroops = `${whole}${paddedFraction}`.replace(/^0+/, '') || '0';
  return stroops;
}

/**
 * Format amount for display with fixed decimals
 * @param amount - Amount as string
 * @param decimals - Number of decimal places to show
 * @returns Formatted string
 */
export function formatAmount(amount: string, decimals: number = 2): string {
  const num = parseFloat(amount);
  return num.toFixed(decimals);
}

/**
 * Add thousand separators to amount
 * @param amount - Amount as string
 * @returns Formatted string with separators
 */
export function addSeparators(amount: string): string {
  const parts = amount.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Validate Stellar amount format
 * @param amount - Amount to validate
 * @returns boolean indicating if valid
 */
export function isValidStellarAmount(amount: string): boolean {
  // Must be a valid number
  if (!/^\d*\.?\d*$/.test(amount) || amount === '') {
    return false;
  }
  
  // Check decimal places (max 7 for Stellar)
  const parts = amount.split('.');
  if (parts.length > 2) return false;
  if (parts[1] && parts[1].length > 7) return false;
  
  // Check if within int64 range when converted to stroops
  try {
    const stroops = BigInt(decimalToStroops(amount));
    const MAX_INT64 = BigInt('9223372036854775807');
    return stroops <= MAX_INT64;
  } catch {
    return false;
  }
}

/**
 * Parse user input for Stellar amounts
 * @param input - User input string
 * @returns Cleaned amount string
 */
export function parseStellarAmount(input: string): string {
  // Remove any non-numeric characters except decimal point
  let cleaned = input.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit to 7 decimal places
  if (parts.length === 2 && parts[1]) {
    cleaned = parts[0] + '.' + parts[1].slice(0, 7);
  }
  
  return cleaned;
}

/**
 * Format balance from Horizon API
 * @param balance - Balance string from Horizon
 * @param assetCode - Asset code (XLM, USDC, etc.)
 * @returns Formatted balance object
 */
export function formatBalance(
  balance: string, 
  assetCode: string
): {
  raw: string;
  formatted: string;
  withSymbol: string;
} {
  const formatted = formatAmount(balance, 2);
  const withSeparators = addSeparators(formatted);
  
  return {
    raw: balance,
    formatted: withSeparators,
    withSymbol: `${withSeparators} ${assetCode}`
  };
}