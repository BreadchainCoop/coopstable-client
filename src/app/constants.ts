export const TOKEN_CODES = {
  XLM: "XLM",
  USDC: "USDC",
  CUSD: "cUSD",
} as const;

export type TokenCode = typeof TOKEN_CODES[keyof typeof TOKEN_CODES];
export const STROOPS_PER_UNIT = 10_000_000; 


export const QUERY_KEYS = {
  BALANCES: ['user_balances'],
  YIELD: ['yield'],
  DISTRIBUTION_PERIOD: ['distribution_period'],
  NEXT_DISTRIBUTION_TIME: ['next_distribution_time'],
  IS_DISTRIBUTION_AVAILABLE: ['is_distribution_available'],
  CUSD_TOTAL_SUPPLY: ['cusd_total_supply'],
  TOTAL_MEMBERS: ['total_members'],
  TREASURY_SHARE: ['treasury_share'],
  YIELD_DATA: ['yield_data'],
  DISTRIBUTION_ROUND: ['distribution_round'],
  TOTAL_DISTRIBUTED: ['total_distributed'],
  TOTAL_APY: ['total_apy'],
}

export const SWAP_MODES = {
  MINT: "MINT",
  BURN: "BURN",
} as const;