import { STROOPS_PER_UNIT } from "@/app/constants";
import { nativeToScVal, xdr } from "@stellar/stellar-sdk";

/**
 * Convert stroops (smallest unit) to decimal string
 * @param stroops - Amount in stroops (as string, number, or bigint)
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
  if (isNaN(num)) return '0.00';
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
 * Format balance from Horizon API (for string balances)
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
  if (!balance || balance === '0' || balance === '') {
    return {
      raw: balance || '0',
      formatted: '0.00',
      withSymbol: `0.00 ${assetCode}`
    };
  }

  const formatted = formatAmount(balance, 2);
  const withSeparators = addSeparators(formatted);
  
  return {
    raw: balance,
    formatted: withSeparators,
    withSymbol: `${withSeparators} ${assetCode}`
  };
}

/**
 * Format balance from contract responses (for bigint balances in stroops)
 * @param stroops - Balance in stroops as bigint
 * @param assetCode - Asset code (XLM, USDC, etc.)
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted balance object
 */
export function formatLumens(
  stroops: bigint,
  assetCode: string,
  decimals: number = 2
): {
  raw: bigint;
  decimal: string;
  formatted: string;
  withSymbol: string;
} {
  const balanceDecimal = stroopsToDecimal(stroops);
  const formatted = formatAmount(balanceDecimal, decimals);
  const withSeparators = addSeparators(formatted);
  
  return {
    raw: stroops,
    decimal: balanceDecimal,
    formatted: withSeparators,
    withSymbol: `${withSeparators} ${assetCode}`
  };
}

/**
 * Convert various input types to stroops as BigInt
 * @param value - Amount as string, number, or bigint
 * @returns Amount in stroops as BigInt
 */
export function toBigInt(value: string | number | bigint): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  
  if (typeof value === "string") {
    // If it's already in stroops (no decimal), return as bigint
    if (!value.includes('.') && value.length > 7) {
      return BigInt(value);
    }
    // Otherwise convert from decimal to stroops
    return BigInt(decimalToStroops(value));
  }
  
  // For numbers, convert to stroops
  return BigInt(Math.round(Number(value) * STROOPS_PER_UNIT));
}

/**
 * Convert value to BigInt stroops and then to ScVal for contract calls
 * @param value - Amount as string, number, or bigint
 * @param type - ScVal type (default: "i128")
 * @returns ScVal for contract parameters
 */
export function parseLumen(value: string | number | bigint, type: string = "i128"): xdr.ScVal {
  return nativeToScVal(toBigInt(value), { type });
}

/**
 * Format stroops to XLM (equivalent to formatEther)
 * @param stroops - Amount in stroops
 * @returns XLM amount as string
 */
export function formatXLM(stroops: string | number | bigint): string {
  return stroopsToDecimal(stroops);
}

/**
 * Format stroops to XLM with symbol (simple version)
 * @param stroops - Amount in stroops
 * @param symbol - Token symbol (default: "XLM")
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with symbol like "1.50 XLM"
 */
export function formatXLMSimple(
  stroops: string | number | bigint, 
  symbol: string = "XLM", 
  decimals: number = 2
): string {
  const decimalAmount = stroopsToDecimal(stroops);
  const formatted = formatAmount(decimalAmount, decimals);
  const withSeparators = addSeparators(formatted);
  return `${withSeparators} ${symbol}`;
}

/**
 * Format stroops to XLM with symbol and formatting options
 * @param stroops - Amount in stroops
 * @param options - Formatting options
 * @returns Formatted XLM object with multiple representations
 */
export function formatXLMWithSymbol(
  stroops: string | number | bigint,
  options: {
    symbol?: string;
    decimals?: number;
    showSymbol?: boolean;
    addSeparators?: boolean;
  } = {}
): {
  raw: string | number | bigint;
  decimal: string;
  formatted: string;
  withSymbol: string;
} {
  const {
    symbol = "XLM",
    decimals = 2,
    showSymbol = true,
    addSeparators: shouldAddSeparators = true
  } = options;

  const decimalAmount = stroopsToDecimal(stroops);
  const fixedAmount = formatAmount(decimalAmount, decimals);
  const formattedAmount = shouldAddSeparators ? addSeparators(fixedAmount) : fixedAmount;
  const withSymbolText = showSymbol ? `${formattedAmount} ${symbol}` : formattedAmount;

  return {
    raw: stroops,
    decimal: decimalAmount,
    formatted: formattedAmount,
    withSymbol: withSymbolText
  };
}

/**
 * Parse XLM to stroops (equivalent to parseEther)
 * @param xlm - XLM amount as string
 * @returns Stroops as string
 */
export function parseXLM(xlm: string): string {
  return decimalToStroops(xlm);
}

/**
 * Parse XLM to stroops as BigInt (for contract calls)
 * @param xlm - XLM amount as string
 * @returns Stroops as BigInt
 */
export function parseXLMToBigInt(xlm: string): bigint {
  return BigInt(decimalToStroops(xlm));
}

/**
 * Format large amounts with K, M, B suffixes
 * @param stroops - Amount in stroops
 * @returns Formatted string with suffix
 */
export function formatLargeAmount(stroops: string | number | bigint): string {
  const decimal = Number(stroopsToDecimal(stroops));
  
  if (decimal >= 1e9) return (decimal / 1e9).toFixed(1) + 'B';
  if (decimal >= 1e6) return (decimal / 1e6).toFixed(1) + 'M';
  if (decimal >= 1e3) return (decimal / 1e3).toFixed(1) + 'K';
  
  return decimal.toFixed(2);
}

/**
 * Safe number formatting that handles edge cases
 * @param value - Value to format
 * @param fallback - Fallback value if formatting fails
 * @returns Formatted string or fallback
 */
export function safeFormatNumber(value: any, fallback: string = '0.00'): string {
  try {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    
    if (typeof value === 'bigint') {
      return stroopsToDecimal(value);
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
      const num = Number(value);
      if (isNaN(num)) return fallback;
      return num.toString();
    }
    
    return fallback;
  } catch {
    return fallback;
  }
}