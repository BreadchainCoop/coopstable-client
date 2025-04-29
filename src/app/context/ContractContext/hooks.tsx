// import { useUser } from "@/app/context/UserContext/UserContext";
import { ContractContext } from "@/app/context/ContractContext/ContractContext";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SignTransaction } from "@stellar/stellar-sdk/contract";
import { chainConfig } from "@/app/config";
import { UserContextStateConnected } from "../UserContext/types";

export function useTokenABalance(user: UserContextStateConnected) {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useTokenABalance must be used within a ContractProvider");

  return useQuery({
    queryKey: [`tokenABalance_${user.account}`],
    queryFn: async () =>
      context.tokenA.fetchBalance(user.account, user.network),
    refetchInterval: 1000,
  });
}

export function useAllowance(user: UserContextStateConnected) {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useAllowance must be used within a ContractProvider");

  return useQuery({
    queryKey: [`allowance_${user.account}`],
    queryFn: async () =>
      context.tokenA.fetchAllowance(
        user.account,
        chainConfig[user.network].addressTokenB,
        user.network
      ),
    refetchInterval: 1000,
  });
}

export function useTokenAMint(signTransaction: SignTransaction) {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useTokenABalance must be used within a ContractProvider");

  const [state, setState] = useState<
    { status: "init" } | { status: "success" }
  >({ status: "init" });

  async function signAndSend(user: UserContextStateConnected, amount: bigint) {
    const tx = await context?.tokenA.mint(user.account, amount, user.network);
    tx
      ?.signAndSend({
        signTransaction: signTransaction,
      })
      .then((res) => {
        setState({ status: "success" });
        console.log(res);
      });
  }

  return { state, signAndSend };
}
