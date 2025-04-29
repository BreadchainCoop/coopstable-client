"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { UserProvider } from "./context/UserContext/UserContext";
import { BalanceProvider } from "./context/BalanceContext";
import { balanceService } from "./services/balanceService";
import { ContractProvider } from "./context/ContractContext/ContractContext";
import { contractService } from "./services/contractService";
import { userService } from "./services/userService";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider userService={userService}>
        <BalanceProvider balanceService={balanceService}>
          <ContractProvider contractService={contractService}>
            {children}
          </ContractProvider>
        </BalanceProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
