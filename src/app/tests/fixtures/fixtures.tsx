import { cleanup, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ContractProvider } from "@/app/context/ContractContext/ContractContext";
import { BalanceProvider } from "@/app/context/AccountContext";
import { UserProvider } from "@/app/context/UserContext/UserContext";
import { NetworkString } from "@/app/services/UserService/types";
import { TransactionProvider } from "@/app/context/TransactionContext/TransactionContext";
import { Header } from "@/app/components/Header";
import { Swap } from "@/app/components/Swap/Swap";

const queryClient = new QueryClient();

export type SetupConfig = {
  usdcBalance: number;
  cusdBalance: number;
  xlmBalance: number;
  txFails: boolean;
};

export function setup(config?: SetupConfig) {
  cleanup();

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
        <BalanceProvider
          balanceService={{
            fetchNativeBalance: async () => {
              return config ? config.xlmBalance.toString() : "1234";
            },
          }}
        >
          <ContractProvider
            contractService={{
              cusd: {
                fetchBalance: async () =>
                  // account: string,
                  // network: NetworkString,
                  {
                    return config ? config.cusdBalance : null;
                  },
                fetchAllowance: async () =>
                  // owner: string,
                  // spender: string,
                  // network: NetworkString,
                  {
                    return null;
                  },
                mint: async () =>
                  // account: string,
                  // amount: bigint,
                  // network: NetworkString,
                  {
                    if (config?.txFails) throw new Error("mint failed!");
                    return null;
                  },
                burn: async () =>
                  // account: string,
                  // amount: bigint,
                  // network: NetworkString,
                  {
                    if (config?.txFails) throw new Error("burn failed!");
                    return null;
                  },
              },
              usdc: {
                fetchBalance: async () =>
                  // user: UserContextStateConnected
                  {
                    return config ? config.usdcBalance : null;
                  },
              },
            }}
          >
            <TransactionProvider>
              <Header />
              <Swap />
            </TransactionProvider>
          </ContractProvider>
        </BalanceProvider>
      </UserProvider>
    </QueryClientProvider>,
  );
}
