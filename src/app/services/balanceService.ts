import { Horizon } from "@stellar/stellar-sdk";
import { chainConfig } from "@/app/config";
import type { UserContextStateConnected } from "@/app/context/UserContext/types";

export type BalanceService = {
  fetchNativeBalance: (
    user: UserContextStateConnected
  ) => Promise<string | null>;
};

async function fetchNativeBalance(user: UserContextStateConnected) {
  const server = new Horizon.Server(chainConfig[user.network].horizonUrl);

  const res = await server.loadAccount(user.account);
  const found = res.balances.find((balance) => balance.asset_type === "native");
  return found?.balance ? found.balance : null;
}

export const balanceService = {
  fetchNativeBalance,
};
