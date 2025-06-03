export type NetworkString = "PUBLIC" | "TESTNET";

export interface WalletConnectionData {
  walletId: string;
  timestamp: number;
}

export type UserService = {
  connectWallet: (
    onConnected: (account: string, network: "PUBLIC" | "TESTNET") => void,
  ) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signTransaction: (
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    },
  ) => Promise<{
    signedTxXdr: string;
    signerAddress?: string;
  }>;
  restoreConnection: (
    onConnected: (account: string, network: "PUBLIC" | "TESTNET") => void,
    onError?: (error: Error) => void,
  ) => Promise<boolean>;
};


