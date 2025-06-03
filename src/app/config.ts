import * as StellarSdk from "@stellar/stellar-sdk";
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
  blend: {
    contractId: string;
  };
};
export type ChainConfig = {
  TESTNET: NetworkConfig;
  PUBLIC: NetworkConfig;
};
export type Network = keyof typeof chainConfig;

export const chainConfig: ChainConfig = {
  TESTNET: {
    networkPassphrase: StellarSdk.Networks.TESTNET,
    sorobanUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
    yieldController: {
      contractId: "CDO2YIXMZXEFAV77Q5TOI4G5L56A2XVDN6J2ERP5H7JDVDEB2UC5AV63",
    },
    cusd: {
      contractId: "CDHHR356G725HNLAAQ74WBGVT6Y6ZFZLM2TIHLDCOZTJ2SVZ7P3EANYT",
    },
    usdc: {
      contractId: "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU",
    },
    blend: {
      contractId: "CB22KRA3YZVCNCQI64JQ5WE7UY2VAV7WFLK6A2JN3HEX56T2EDAFO7QF",
    },
  },
  PUBLIC: {
    networkPassphrase: StellarSdk.Networks.PUBLIC,
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
    blend: {
      contractId: "",
    },
  },
};

export function getNetworkConfig(network: Network) {
  switch (network) {
    case "TESTNET":
      return chainConfig.TESTNET;
    case "PUBLIC":
      return chainConfig.PUBLIC;
    default:
      throw new Error("Invalid network");
  }
}