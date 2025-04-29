export type NetworkConfig = {
  sorobanUrl: string;
  horizonUrl: string;
  addressTokenA: string;
  addressTokenB: string;
};
export type ChainConfig = {
  TESTNET: NetworkConfig;
  PUBLIC: NetworkConfig;
};

export const chainConfig: ChainConfig = {
  TESTNET: {
    sorobanUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
    addressTokenA: "CAWYKWTX2G4YUVH47YTV3ON7V522J5K7WNPAH22THSZA3DSDIR5ZJMTD",
    addressTokenB: "CAOZBJUM3T7E337D77V5H6AW4B4S5P6CSLVKSHG2MOFAVTW6W4Y3CKSA",
  },
  PUBLIC: {
    sorobanUrl: "https://rpc.ankr.com/stellar_soroban",
    horizonUrl: "https://rpc.ankr.com/http/stellar_horizon",
    addressTokenA: "string",
    addressTokenB: "string",
  },
};
