import { cleanup, render, fireEvent, getByRole, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ContractProvider } from "@/app/context/ContractContext/ContractContext";
import { AccountProvider } from "@/app/context/AccountContext";
import { UserProvider } from "@/app/context/UserContext/UserContext";
import { NetworkString } from "@/app/services/UserService/types";
import { TransactionProvider } from "@/app/context/TransactionContext/TransactionContext";
import { Header } from "@/app/components/Header";
import { Swap } from "@/app/components/Swap/Swap";
import { Asset } from "@stellar/stellar-sdk";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export type SetupConfig = {
  usdcBalance: number;
  cusdBalance: number;
  xlmBalance: number;
  txFails: boolean;
};

export function setup(config?: SetupConfig) {
  cleanup();
  queryClient.clear();

  render(
    <QueryClientProvider client={queryClient}>
      <UserProvider
        userService={{
          async connectWallet(
            onConnected: (account: string, network: NetworkString) => void,
          ) {
            onConnected(
              "GC6O4Z7UEUVNBZCW2HT2KNCBDONUZKDSWLJ22P2RJASAL6NQ7VVUAQGY",
              "TESTNET",
            );
          },
          async disconnectWallet() {},
          async signTransaction() {
            return { signedTxXdr: "" };
          },
        }}
      >
        <AccountProvider
          accountService={{
            fetchAccount: async () => {
              return {
                sequenceNumber: "123",
                balances: {
                  NATIVE: { balance: config?.xlmBalance.toString() ?? "1234", asset: Asset.native(), requiresTrustline: false },
                  USDC: { balance: config?.usdcBalance.toString() ?? "1000", asset: new Asset("USDC", "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"), requiresTrustline: false },
                  CUSD: { balance: config?.cusdBalance.toString() ?? "1000", asset: new Asset("CUSD", "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"), requiresTrustline: false },
                },
              };
            },
            createTrustlines: async () => true,
          }}
        >
          <ContractProvider>
            <TransactionProvider>
              <Header />
              <Swap />
            </TransactionProvider>
          </ContractProvider>
        </AccountProvider>
      </UserProvider>
    </QueryClientProvider>,
  );
}

export async function signin() {
  await fireEvent.click(
    await getByRole(await screen.findByTestId("header"), "button", {
      name: "Sign In",
    }),
  );
}
