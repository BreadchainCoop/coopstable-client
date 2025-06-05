"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { UserProvider } from "./context/UserContext/UserContext";
import { AccountProvider } from "./context/AccountContext";
import { accountService } from "./services/accountService";
import { ContractProvider } from "./context/ContractContext/ContractContext";
import { userService } from "./services/UserService/UserService";
import { TransactionProvider } from "./context/TransactionContext/TransactionContext";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider userService={userService}>
        <AccountProvider accountService={accountService}>
          <ContractProvider>
            <TransactionProvider>{children}</TransactionProvider>
          </ContractProvider>
        </AccountProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
