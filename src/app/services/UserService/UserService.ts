import {
  allowAllModules,
  FREIGHTER_ID,
  ISupportedWallet,
  StellarWalletsKit,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";
import { NetworkString } from "./types";

const kit: StellarWalletsKit = new StellarWalletsKit({
  network: WalletNetwork.PUBLIC,
  selectedWalletId: FREIGHTER_ID,
  modules: allowAllModules(),
});

export async function connectWallet(
  onConnected: (account: string, network: NetworkString) => void,
) {
  await kit.openModal({
    onWalletSelected: async (option: ISupportedWallet) => {
      kit.setWallet(option.id);
      const account = (await kit.getAddress()).address;
      const network = (await kit.getNetwork()).network;
      if (network !== "TESTNET" && network !== "PUBLIC")
        throw new Error("invalid network string");
      onConnected(account, network);
    },
  });
}
export async function disconnectWallet() {
  await kit.disconnect();
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
  return kit.signTransaction(xdr, opts);
}

export const userService = {
  connectWallet,
  disconnectWallet,
  signTransaction,
};
