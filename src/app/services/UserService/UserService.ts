import {
  allowAllModules,
  FREIGHTER_ID,
  ISupportedWallet,
  StellarWalletsKit,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";
import { NetworkString, WalletConnectionData } from "./types";
import { DEFAULT_NETWORK, SUPPORTED_NETWORKS } from "@/app/config";
const WALLET_CONNECTION_KEY = "coop-stable-wallet-connection";

let kit: StellarWalletsKit | null = null;

function getKit(): StellarWalletsKit {
  if (!kit) {
    kit = new StellarWalletsKit({
      network: DEFAULT_NETWORK === SUPPORTED_NETWORKS.TESTNET ? WalletNetwork.TESTNET : WalletNetwork.PUBLIC,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    });
  }
  return kit;
}

function isConnectionValid(data: WalletConnectionData): boolean {
  const EXPIRY_TIME = 24 * 60 * 60 * 1000;
  return Date.now() - data.timestamp < EXPIRY_TIME;
}

function saveConnectionInfo(walletId: string) {
  try {
    const data: WalletConnectionData = {
      walletId,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(WALLET_CONNECTION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save connection info:", error);
  }
}

function clearConnectionInfo() {
  try {
    sessionStorage.removeItem(WALLET_CONNECTION_KEY);
  } catch (error) {
    console.error("Failed to clear connection info:", error);
  }
}

function getSavedConnectionInfo(): WalletConnectionData | null {
  try {
    const saved = sessionStorage.getItem(WALLET_CONNECTION_KEY);
    if (!saved) return null;
    
    const data = JSON.parse(saved) as WalletConnectionData;
    if (!isConnectionValid(data)) {
      sessionStorage.removeItem(WALLET_CONNECTION_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to get connection info:", error);
    return null;
  }
}

export async function restoreConnection(
  onConnected: (account: string, network: NetworkString) => void,
  onError?: (error: Error) => void
): Promise<boolean> {
  try {
    const savedInfo = getSavedConnectionInfo();
    if (!savedInfo) return false;

    getKit().setWallet(savedInfo.walletId);

    const { address } = await getKit().getAddress();
    const { network } = await getKit().getNetwork();
    
    if (network !== "TESTNET" && network !== "PUBLIC") {
      throw new Error("Invalid network string");
    }

    onConnected(address, network);
    return true;
  } catch (error) {
    clearConnectionInfo();
    onError?.(error as Error);
    return false;
  }
}

export async function connectWallet(
  onConnected: (account: string, network: NetworkString) => void,
) {
  await getKit().openModal({
    onWalletSelected: async (option: ISupportedWallet) => {
      getKit().setWallet(option.id);
      const account = (await getKit().getAddress()).address;
      const network = (await getKit().getNetwork()).network;
      if (network !== "TESTNET" && network !== "PUBLIC")
        throw new Error("invalid network string");
      
      saveConnectionInfo(option.id);
      
      onConnected(account, network);
    },
  });
}

export async function disconnectWallet() {
  await getKit().disconnect();
  clearConnectionInfo();
}

async function signTransaction(
  xdr: string,
  opts?: {
    networkPassphrase?: string;
    address?: string;
    path?: string;
    submit?: boolean;
    submitUrl?: string;
  },
): Promise<{
  signedTxXdr: string;
  signerAddress?: string;
}> {
  return getKit().signTransaction(xdr, opts);
}

export const userService = {
  connectWallet,
  disconnectWallet,
  signTransaction,
  restoreConnection,
};