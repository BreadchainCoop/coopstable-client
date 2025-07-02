import { Horizon, Asset, rpc, Transaction, TransactionBuilder, Operation } from "@stellar/stellar-sdk";
import { getNetworkConfig, getProtocolAssets, Network } from "@/app/config";
import { NetworkString } from "./UserService/types";
import { SignTransaction } from "@stellar/stellar-sdk/contract";
import { requiresTrustline } from "../utils";
import { TOKEN_CODES } from "../constants";

export type AccountValues = {
  sequenceNumber: string;
  balances: BalanceValues;
};

export type BalanceValues = {
  NATIVE: {
    asset: Asset;
    balance: string;
    requiresTrustline: boolean;
  };
  USDC: {
    asset: Asset;
    balance: string;
    requiresTrustline: boolean;
  } | null;
  CUSD: {
    asset: Asset;
    balance: string;
    requiresTrustline: boolean;
  } | null;
};

export type AccountService = {
  fetchAccount: (
    account: string,
    network: NetworkString,
  ) => Promise<AccountValues>;
  createTrustlines: (params: {
    walletAddress: string, 
    network: NetworkString,
    signTransaction: SignTransaction,
    assets: Asset[],
    inclusionFee: InclusionFee,
  }) => Promise<boolean>;
};

async function fetchAccount(account: string, network: NetworkString) {
  const config = getNetworkConfig(network);
  const server = new Horizon.Server(config.horizonUrl);
  const res = await server.loadAccount(account);
  const sequenceNumber = res.sequence;
  const protocolAssets = getProtocolAssets(network);
  const balances = res.balances.reduce<BalanceValues>(
    (acc, balance) => {
      if (balance.asset_type === "native") {
        acc.NATIVE = {
          asset: Asset.native(),
          balance: balance.balance,
          requiresTrustline: false
        };
      }
      if (balance.asset_type === "credit_alphanum4") {
        const accountAsset = new Asset(balance.asset_code, balance.asset_issuer);
        if (
          balance.asset_code === TOKEN_CODES.USDC && 
          balance.asset_issuer === config.usdc.issuer
        ) {
          acc.USDC = {
            asset: accountAsset,
            balance: balance.balance,
            requiresTrustline: requiresTrustline(
              accountAsset,
              protocolAssets,
            ),
          };
        }
        if (balance.asset_code === TOKEN_CODES.CUSD.toUpperCase()) {
          acc.CUSD = {
            asset: accountAsset,
            balance: balance.balance,
            requiresTrustline: requiresTrustline(
              accountAsset,
              protocolAssets,
            ),
          };
        }
      }
      return acc;
    },
    {
      NATIVE: {
        asset: Asset.native(),
        balance: "0",
        requiresTrustline: false,
      },
      USDC: null,
      CUSD: null,
    },
  );
  // ensure all the balances assets are in the balances object 
  protocolAssets.forEach((asset) => {
    const code = asset.getCode();
    const balance = balances[code as keyof typeof balances];
    if (!balance) {
      balances[code as keyof typeof balances] = {
        asset,
        balance: "0",
        requiresTrustline: true,
      };
    }
  });
  return { balances, sequenceNumber };
}

export interface InclusionFee {
  type: 'Low' | 'Medium' | 'High';
  fee: string;
}

async function createTrustlines({
  walletAddress, 
  network,
  signTransaction,
  assets,
  inclusionFee,
}: {
  walletAddress: string, 
  network: Network,
  assets: Asset[],
  inclusionFee: InclusionFee,
  signTransaction: SignTransaction
}) {
  const config = getNetworkConfig(network);
  const stellarRpc = new rpc.Server(config.sorobanUrl, {
    allowHttp: true,
  });
  const account = await stellarRpc.getAccount(walletAddress);
  const tx_builder = new TransactionBuilder(account, {
    networkPassphrase: "Test SDF Network ; September 2015",
    fee: inclusionFee.fee,
    timebounds: { 
      minTime: 0, 
      maxTime: Math.floor(Date.now() / 1000) + 2 * 60 * 1000 
    },
  });
  for (let asset of assets) {
    const trustlineOperation = Operation.changeTrust({
      asset: asset,
    });
    tx_builder.addOperation(trustlineOperation);
  }
  const transaction = tx_builder.build();
  const signedTx = await signTransaction(transaction.toXDR());
  const tx = new Transaction(signedTx.signedTxXdr, "Test SDF Network ; September 2015");
  return await sendTransaction(tx, stellarRpc);
}

async function sendTransaction(transaction: Transaction, stellarRpc: rpc.Server): Promise<boolean> {
  let sendTxResponse = await stellarRpc.sendTransaction(transaction);
  let currTime = Date.now();

  while (sendTxResponse.status !== 'PENDING' && Date.now() - currTime < 5000) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    sendTxResponse = await stellarRpc.sendTransaction(transaction);
  }

  if (sendTxResponse.status !== 'PENDING') {
    throw new Error(`Failed to submit transaction: ${sendTxResponse.errorResult?.result}`);
  }


  currTime = Date.now();
  let getTxResponse = await stellarRpc.getTransaction(sendTxResponse.hash);
  while (getTxResponse.status === 'NOT_FOUND' && Date.now() - currTime < 30000) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    getTxResponse = await stellarRpc.getTransaction(sendTxResponse.hash);
  }

  if (getTxResponse.status === 'NOT_FOUND') {
    console.log('Failed to send transaction', sendTxResponse.hash, sendTxResponse.errorResult); 
    throw new Error('Transaction confirmation timeout');
  }
  
  if (getTxResponse.status === 'SUCCESS') {
    console.log('Transaction successful:', transaction.hash().toString('hex'));
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  } else {
    throw new Error(`Transaction failed: ${getTxResponse.status}`);
  }
}

export const accountService: AccountService = {
  fetchAccount,
  createTrustlines,
};
