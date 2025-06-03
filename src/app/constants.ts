export const TOKEN_CODES = {
  XLM: "XLM",
  USDC: "USDC",
  CUSD: "cUSD",
} as const;

export type TokenCode = typeof TOKEN_CODES[keyof typeof TOKEN_CODES];

export const STROOPS_PER_UNIT = 10_000_000; 