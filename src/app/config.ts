export type NetworkConfig = {
  networkPassphrase: string;
  sorobanUrl: string;
  horizonUrl: string;
  yieldController: {
    contractId: string;
  };
  cusd: {
    contractId: string;
  };
  usdc: {
    contractId: string;
  };
};

export type ChainConfig = {
  TESTNET: NetworkConfig;
  PUBLIC: NetworkConfig;
};

export const chainConfig: ChainConfig = {
  TESTNET: {
    networkPassphrase: "Test SDF Network ; September 2015",
    sorobanUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
    yieldController: {
      contractId: "CBQSGJM2A4EWTBEW2BDIP2OBNZB2SAZSV5K7MPELISICR7BFDLNH3B6H",
    },
    cusd: {
      contractId: "CDHHR356G725HNLAAQ74WBGVT6Y6ZFZLM2TIHLDCOZTJ2SVZ7P3EANYT",
    },
    usdc: {
      contractId: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
    },
  },
  PUBLIC: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    sorobanUrl: "https://rpc.ankr.com/stellar_soroban",
    horizonUrl: "https://rpc.ankr.com/http/stellar_horizon",
    yieldController: {
      contractId: "",
    },
    cusd: {
      contractId: "CDHHR356G725HNLAAQ74WBGVT6Y6ZFZLM2TIHLDCOZTJ2SVZ7P3EANYT",
    },
    usdc: {
      contractId: "",
    },
  },
};
