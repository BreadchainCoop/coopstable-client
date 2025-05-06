// import { useUser } from "@/app/context/UserContext/UserContext";
import { ContractContext } from "@/app/context/ContractContext/ContractContext";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SignTransaction } from "@stellar/stellar-sdk/contract";
import { chainConfig } from "@/app/config";
import { UserContextStateConnected } from "../UserContext/types";
import { NetworkString } from "@/app/services/userService";

export function useTokenABalance(account: string, network: NetworkString) {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useTokenABalance must be used within a ContractProvider");

  return useQuery({
    queryKey: [`tokenABalance_${account}`],
    queryFn: async () => context.tokenA.fetchBalance(account, network),
    refetchInterval: 1000,
  });
}

export function useAllowance(account: string, network: NetworkString) {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useAllowance must be used within a ContractProvider");

  return useQuery({
    queryKey: [`allowance_${account}`],
    queryFn: async () =>
      context.tokenA.fetchAllowance(
        account,
        chainConfig[network].addressTokenB,
        network,
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
