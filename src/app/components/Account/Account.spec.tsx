import { expect, test } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { BalanceProvider } from "../../context/BalanceContext";
import { AccountConnected } from "./Connected";
import { ContractProvider } from "@/app/context/ContractContext/ContractContext";
import { contractService } from "@/app/services/contractService";

const queryClient = new QueryClient();

test("displays native token balance", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <BalanceProvider
        balanceService={{
          fetchNativeBalance: async () => {
            return "1234";
          },
        }}
      >
        <ContractProvider contractService={contractService}>
          <AccountConnected
            user={{
              account: "test",
              status: "connected",
              network: "TESTNET",
            }}
            disconnect={() => {}}
          />
        </ContractProvider>
      </BalanceProvider>
    </QueryClientProvider>,
  );

  await expect(await screen.findByText("1234")).toBeTruthy();
});
