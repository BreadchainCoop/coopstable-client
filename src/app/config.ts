import * as StellarSdk from "@stellar/stellar-sdk";
import { getRequiredEnvVar } from "./utils/config";
export type NetworkConfig = {
  network: Network;
  networkPassphrase: string;
  sorobanUrl: string;
  horizonUrl: string;
  explorerUrl: string;
  yieldController: {
    contractId: string;
  };
  yieldDistributor: {
    contractId: string;
  };
  cusd: {
    contractId: string;
  };
  usdc: {
    contractId: string;
    issuer: string;
  };
  blend: {
    contractId: string;
  };
};
export type ChainConfig = {
  TESTNET: NetworkConfig;
  PUBLIC: NetworkConfig;
};

export const SUPPORTED_NETWORKS = {
  TESTNET: "TESTNET",
  PUBLIC: "PUBLIC",
} as const;

export type Network = typeof SUPPORTED_NETWORKS[keyof typeof SUPPORTED_NETWORKS];

// export const DEFAULT_NETWORK = getRequiredEnvVar("NEXT_PUBLIC_DEFAULT_NETWORK") as Network;
export const DEFAULT_NETWORK = process.env.NEXT_PUBLIC_DEFAULT_NETWORK as Network;

export const chainConfig: ChainConfig = {
  TESTNET: {
    network: SUPPORTED_NETWORKS.TESTNET,
    networkPassphrase: StellarSdk.Networks.TESTNET,
    explorerUrl: "https://stellar.expert/explorer/testnet",
    sorobanUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
    yieldController: {
      contractId: "CCPWUJBVYG3R45UU4IRDNDOSANN2L4KJQMDPEGLDTQIKPJTBSDOUY7M4",
    },
    yieldDistributor: {
      contractId: "CBHJBD7PSM524MBLIRBKMVNBDK4EFPS7T4XIPA5OCC4E2BRPM4ZXYUVG",
    },
    cusd: {
      contractId: "CDHHR356G725HNLAAQ74WBGVT6Y6ZFZLM2TIHLDCOZTJ2SVZ7P3EANYT",
    },
    usdc: {
      contractId: "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU",
      issuer: "GATALTGTWIOT6BUDBCZM3Q4OQ4BO2COLOAZ7IYSKPLC2PMSOPPGF5V56",
    },
    blend: {
      contractId: "CB22KRA3YZVCNCQI64JQ5WE7UY2VAV7WFLK6A2JN3HEX56T2EDAFO7QF",
    },
  },
  PUBLIC: {
    network: SUPPORTED_NETWORKS.PUBLIC,
    explorerUrl: "https://stellar.expert/explorer/public",
    networkPassphrase: StellarSdk.Networks.PUBLIC,
    sorobanUrl: "https://rpc.ankr.com/stellar_soroban",
    horizonUrl: "https://rpc.ankr.com/http/stellar_horizon",
    yieldController: {
      contractId: "",
    },
    yieldDistributor: {
      contractId: "",
    },
    cusd: {
      contractId: "CDHHR356G725HNLAAQ74WBGVT6Y6ZFZLM2TIHLDCOZTJ2SVZ7P3EANYT",
    },
    usdc: {
      contractId: "",
      issuer: "",
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