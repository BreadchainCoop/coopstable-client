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
    sorobanUrl: "https://soroban-public.stellar.org",
    horizonUrl: "https://horizon-public.stellar.org",
    yieldController: {
      contractId: "CAAKQRIPSVYCLM2JRJPAMIDUHN47VQPV7YI3RGT2C7HNJ45H7XZIK3F5",
    },
    yieldDistributor: {
      contractId: "CDUZHDM7EBTK7MSHAFJH57UXCBUXEJ6AAL555Y2P7ZQDJKAH4POGD3VW",
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
      contractId: "CBZ6IBKIFPIODZ34RSGMSNORRAATQ4V2WCVRX6VU4YIBFP7SGJ5TWCQT",
    },
    blend: {
      contractId: "CB22KRA3YZVCNCQI64JQ5WE7UY2VAV7WFLK6A2JN3HEX56T2EDAFO7QF",
    },
  },
  PUBLIC: {
    network: SUPPORTED_NETWORKS.PUBLIC,
    explorerUrl: "https://stellar.expert/explorer/public",
    networkPassphrase: StellarSdk.Networks.PUBLIC,
    sorobanUrl: "https://mainnet.sorobanrpc.com",
    horizonUrl: "https://horizon.stellar.lobstr.co",
    yieldController: {
      contractId: "CB2RILXU4W7EO7TDHAQMU6CXMSMSK7WIICKOB2BDFBYBF6K5XEYN335D",
    },
    yieldDistributor: {
      contractId: "CDRAYSJCXZRHGHSKL6HNXSPXJFLI3W3BPHYSPRJ4XJPY2IDMIT5M6WML",
    },
    cusd: {
      contractId: "CA7JSNCTAGTVXJJX65YIN53XAXK72NZPD5Q62YUQXV7R7V45ELKONCJ5",
      issuer: "GB4E4EA26SXUJSFJTMFCVGVNEKWGNQ44MLFRHHXWQHQ54RD7KQTYBNSR",
      code: TOKEN_CODES.CUSD,
    },
    usdc: {
      contractId: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      issuer: "GDMTVHLWJTHSUDMZVVMXXH6VJHA2ZV3HNG5LYNAZ6RTWB7GISM6PGTUV",
      code: TOKEN_CODES.USDC,
    },
    cusdManager: {
      contractId: "CD5QRSQR76HRVLGMDG2UZ3A2DRSQCAHEWW4JIAMSOLVTHDJQ3UMIVIGB",
    },
    blend: {
      contractId: "CD25MNVTZDL4Y3XBCPCJXGXATV5WUHHOWMYFF4YBEGU5FCPGMYTVG5JY",
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