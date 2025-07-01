import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";
import { AccountService, InclusionFee } from "../services/accountService";
import { NetworkString } from "../services/UserService/types";
import { QUERY_KEYS } from "../constants";
import { SignTransaction } from "@stellar/stellar-sdk/contract";
import { Asset } from "@stellar/stellar-sdk";

const BalanceContext = createContext<AccountService | undefined>(undefined); 

type BalanceResult<T> =
  | BalanceResultSuccess<T>
  | BalanceResultPending<T>
  | BalanceResultError<T>;

type BalanceResultPending<T> = {
  status: "pending";
  data: T | null;
  error: null;
};

type BalanceResultSuccess<T> = {
  status: "success";
  data: T | null;
  error: null;
};

type BalanceResultError<T> = {
  status: "error";
  data: T | null;
  error: Error;
};


export function AccountProvider({
  accountService,
  children,
}: {
  readonly children: ReactNode;
  readonly accountService: AccountService;
}) {

  return (
    <BalanceContext.Provider value={accountService}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useAccount(account: string, network: NetworkString) {
  const context = useContext(BalanceContext);
  if (!context)
    throw new Error("useNativeBalance must be used within a BalanceContext");

  return useQuery({
    queryKey: QUERY_KEYS.BALANCES,
    queryFn: async () => context.fetchAccount(account, network),
  });
}

function buildError<T>(error: Error, data: T | null): BalanceResultError<T> {
  return ({ 
    status: 'error',
    error,
    data,
  })
}

export function useAddTrustlines(){
  const context = useContext(BalanceContext);
  if (!context)
    throw new Error("useAddTrustline must be used within a BalanceContext");
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, { walletAddress: string,  network: NetworkString,  assets: Asset[], inclusionFee: InclusionFee, signTransaction: SignTransaction }>({
    mutationFn: context.createTrustlines, 
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BALANCES })
  });
}

export function useNativeBalance(
  account: string,
  network: NetworkString,
): BalanceResult<string> {
  const context = useContext(BalanceContext);
  if (!context)
    throw new Error("useNativeBalance must be used within a BalanceContext");

  const balances = useAccount(account, network);
  switch (balances.status) {
    case "pending":
      return {
        status: balances.status,
        error: balances.error,
        data: null,
      };
    case "success":
      return {
        status: balances.status,
        error: balances.error,
        data: balances.data.balances.NATIVE.balance,
      };
    case "error":
      return buildError<string>(balances.error, null);
    default:
      throw new Error("unhandled case in switch");
  }
}

export function useUSDCBalance(
  account: string,
  network: NetworkString,
): BalanceResult<string> {
  const context = useContext(BalanceContext);
  if (!context)
    throw new Error("useNativeBalance must be used within a BalanceContext");

  const balances = useAccount(account, network);

  switch (balances.status) {
    case "pending":
      return {
        status: balances.status,
        error: balances.error,
        data: null,
      };
    case "success":
      return {
        status: balances.status,
        error: balances.error,
        data: balances.data.balances.USDC ? balances.data.balances.USDC.balance : null,
      };
    case "error":
      return buildError<string>(balances.error, null);
    default:
      throw new Error("unhandled case in switch");
  }
}

export function useCUSDBalance(
  account: string,
  network: NetworkString,
): BalanceResult<string> {
  const context = useContext(BalanceContext);
  if (!context)
    throw new Error("useNativeBalance must be used within a BalanceContext");

  const balances = useAccount(account, network);

  switch (balances.status) {
    case "pending":
      return {
        status: balances.status,
        error: balances.error,
        data: null,
      };
    case "success":
      return {
        status: balances.status,
        error: balances.error,
        data: balances.data.balances.CUSD ? balances.data.balances.CUSD.balance : null,
      };
    case "error":
      return buildError<string>(balances.error, null);
    default:
      throw new Error("unhandled case in switch");
  }
}

export function useSequenceNumber(
  account: string,
  network: NetworkString,
): BalanceResult<string> {
  const context = useContext(BalanceContext);
  if (!context)
    throw new Error("useSequenceNumber must be used within an AccountContext");

  const balances = useAccount(account, network);

  switch (balances.status) {
    case "pending":
      return {
        status: balances.status,
        error: balances.error,
        data: null,
      };
    case "success":
      return {
        status: balances.status,
        error: balances.error,
        data: balances.data.sequenceNumber,
      };
    case "error":
      return buildError<string>(balances.error, null);
    default:
      throw new Error("unhandled case in switch");
  }
}

export function useUserBalance(
  account: string,
  network: NetworkString,
  token: string,
) {
  const context = useContext(BalanceContext);
  if (!context)
    throw new Error("useUserBalance must be used within a BalanceContext");

  const balances = useAccount(account, network);
  switch (balances.status) {
    case "pending":
      return {
        status: balances.status,
        error: balances.error,
        data: null,
      };
    case "success":
      return {
        status: balances.status,
        error: balances.error,
        data: balances.data.balances[token.toUpperCase() as keyof typeof balances.data.balances],
      };
    case "error":
      return buildError<string>(balances.error, null);
    default:
      throw new Error("unhandled case in switch");
  }
}
