import { Horizon } from "@stellar/stellar-sdk";
import { getNetworkConfig } from "@/app/config";
import { NetworkString } from "./UserService/types";

export type AccountValues = {
  sequenceNumber: string;
  balances: BalanceValues;
};

export type BalanceValues = {
  NATIVE: string;
  USDC: string | null;
  CUSD: string | null;
};

export type AccountService = {
  fetchAccount: (
    account: string,
    network: NetworkString,
  ) => Promise<AccountValues>;
};

async function fetchAccount(account: string, network: NetworkString) {
  const config = getNetworkConfig(network);
  const server = new Horizon.Server(config.horizonUrl);
  const res = await server.loadAccount(account);
  const sequenceNumber = res.sequence;
  



  const balances = res.balances.reduce<BalanceValues>(
    (acc, balance) => {
      if (balance.asset_type === "native") {
        acc.NATIVE = balance.balance;
      }
      if (balance.asset_type === "credit_alphanum4") {
        if (
          balance.asset_code === "USDC" && 
          balance.asset_issuer === config.usdc.issuer
        ) {
          acc.USDC = balance.balance;
        }
        if (balance.asset_code === "CUSD") {
          acc.CUSD = balance.balance;
        }
      }
      return acc;
    },
    {
      NATIVE: "",
      USDC: null,
      CUSD: null,
    },
  );

  return { balances, sequenceNumber };
}

export const accountService: AccountService = {
  fetchAccount,
};
