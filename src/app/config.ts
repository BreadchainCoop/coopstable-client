import * as StellarSdk from "@stellar/stellar-sdk";
import { TOKEN_CODES } from "./constants";
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
    issuer: string;
    code: string;
  };
  usdc: {
    contractId: string;
    issuer: string;
    code: string;
  };
  blend: {
    contractId: string;
  };
  cusdManager: {
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
export const DEFAULT_NETWORK = process.env.NEXT_PUBLIC_DEFAULT_NETWORK as Network;

export const chainConfig: ChainConfig = {
  TESTNET: {
    network: SUPPORTED_NETWORKS.TESTNET,
    networkPassphrase: StellarSdk.Networks.TESTNET,
    explorerUrl: "https://stellar.expert/explorer/testnet",
    sorobanUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
    yieldController: {
      contractId: "CAEQUODVDMLFBWIIIX57YVJPEB44HZO3NSSKBWU2JTBI3HJP6RFNQNEF",
    },
    yieldDistributor: {
      contractId: "CDLEO6XBWKCNPJRSYQEX4ZUATUT54RKDLSJAKDZ2QVBL56CGHBRGWYHH",
    },
    cusd: {
      contractId: "CDHBZE4M6EGNYX2436W2FLZGWUSWQQKCC7TORNQJ7SFRC3R5QQ2N7TF2",
      issuer: "GC2AK3SEQPKZX3EYYY3SUMJAUWSJSYIVI3XFTYX6OAIXGDPOF4YTS7GL",
      code: TOKEN_CODES.CUSD,
    },
    usdc: {
      contractId: "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU",
      issuer: "GATALTGTWIOT6BUDBCZM3Q4OQ4BO2COLOAZ7IYSKPLC2PMSOPPGF5V56",
      code: TOKEN_CODES.USDC,
    },
    cusdManager: {
      contractId: "CCBLULDUMYLMY64G766KCHQESMZQDNRGDRHJRCPBOW3AYHWRG7PLFKK5",
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
      contractId: "CDHBZE4M6EGNYX2436W2FLZGWUSWQQKCC7TORNQJ7SFRC3R5QQ2N7TF2",
      issuer: "GC2AK3SEQPKZX3EYYY3SUMJAUWSJSYIVI3XFTYX6OAIXGDPOF4YTS7GL",
      code: TOKEN_CODES.CUSD,
    },
    usdc: {
      contractId: "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU",
      issuer: "GATALTGTWIOT6BUDBCZM3Q4OQ4BO2COLOAZ7IYSKPLC2PMSOPPGF5V56",
      code: TOKEN_CODES.USDC,
    },
    cusdManager: {
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

export function getProtocolAssets(network: Network) {
  switch (network) {
    case "TESTNET":
      return [
        new StellarSdk.Asset(TOKEN_CODES.USDC, chainConfig.TESTNET.usdc.issuer),
        new StellarSdk.Asset(TOKEN_CODES.CUSD.toUpperCase(), chainConfig.TESTNET.cusd.issuer),
      ];
    case "PUBLIC":
      return [
        new StellarSdk.Asset(TOKEN_CODES.USDC, chainConfig.PUBLIC.usdc.issuer),
        new StellarSdk.Asset(TOKEN_CODES.CUSD.toUpperCase(), chainConfig.PUBLIC.cusd.issuer),
      ]
    default:
      throw new Error("Invalid network");
  }
}