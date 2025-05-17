export type NetworkString = "PUBLIC" | "TESTNET";

export type UserService = {
  connectWallet: (
    onConnected: (account: string, network: "PUBLIC" | "TESTNET") => void,
  ) => void;
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
};
