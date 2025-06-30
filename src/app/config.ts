import * as StellarSdk from "@stellar/stellar-sdk";
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
      contractId: "CCVRXJ257N7TMAUNLZ54XN3WNK6QC47YDDENWOY7LGXGCAUUDXL3LKU5",
    },
    yieldDistributor: {
      contractId: "CCGJ7GHCSOU3J6WDYRQYMAJIZKAXFUOJAA67CAW2JR6AVFWI26DOONVL",
    },
    cusd: {
      contractId: "CDHBZE4M6EGNYX2436W2FLZGWUSWQQKCC7TORNQJ7SFRC3R5QQ2N7TF2",
    },
    usdc: {
      contractId: "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU",
      issuer: "GATALTGTWIOT6BUDBCZM3Q4OQ4BO2COLOAZ7IYSKPLC2PMSOPPGF5V56",
    },
    cusdManager: {
      contractId: "CBM5XLCK4JYHBHOELVIVTOOKP3KIB2BR4IY4HW4GNJ5Q53DJV62IOFRQ",
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


// async function createTrustlines(assets: Asset[]) {
//   try {
//     if (connected) {
//       const account = await stellarRpc.getAccount(walletAddress);
//       const tx_builder = new TransactionBuilder(account, {
//         networkPassphrase: network.passphrase,
//         fee: txInclusionFee.fee,
//         timebounds: { minTime: 0, maxTime: Math.floor(Date.now() / 1000) + 2 * 60 * 1000 },
//       });
//       for (let asset of assets) {
//         const trustlineOperation = Operation.changeTrust({
//           asset: asset,
//         });
//         tx_builder.addOperation(trustlineOperation);
//       }
//       const transaction = tx_builder.build();
//       const signedTx = await sign(transaction.toXDR());
//       const tx = new Transaction(signedTx, network.passphrase);
//       setTxType(TxType.PREREQ);
//       const result = await sendTransaction(tx);
//       if (result) {
//         cleanWalletCache();
//       }
//     }
//   } catch (e: any) {
//     console.error('Failed to create trustline: ', e);
//     setFailureMessage(e?.message);
//     setTxStatus(TxStatus.FAIL);
//   }
// }

// export function requiresTrustline(
//   account: Horizon.AccountResponse | undefined,
//   asset: Asset | undefined
// ): boolean {
//   // no trustline required for unloaded account or asset
//   if (!account || !asset) return false;
//   /** @TODO this condition can prolly be improved */
//   return !account.balances.some((balance) => {
//     if (balance.asset_type == 'native') {
//       return asset.isNative();
//     }
//     // @ts-ignore
//     return balance.asset_code === asset.getCode() && balance.asset_issuer === asset.getIssuer();
//   });
// }
// consider the following Makefile, its based on real code so all contracts here work and the deploy-protocol works. I need to now improve the deploy-cusd-token workflow so that it does the following everytime its run: 

// deploy the cusd:owner asset (as you showed above)

// deploy the cusd_token smart_contract and associate it to the cusd:owner

 