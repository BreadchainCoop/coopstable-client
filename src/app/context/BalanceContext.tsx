import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";
import type { UserContextStateConnected } from "./UserContext/types";
import { BalanceService } from "../services/balanceService";

const BalanceContext = createContext<BalanceService | undefined>(undefined);

export function BalanceProvider({
  balanceService,
  children,
}: {
  balanceService: BalanceService;
  children: ReactNode;
}) {
  return (
    <BalanceContext.Provider value={balanceService}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useNativeBalance(user: UserContextStateConnected) {
  const context = useContext(BalanceContext);
  if (!context)
    throw new Error("useNativeBalance must be used within a BalanceContext");

  return useQuery({
    queryKey: [`nativeBalance_${user.account}`],
    queryFn: async () => context.fetchNativeBalance(user.account, user.network),
    enabled: false,
  });
}
