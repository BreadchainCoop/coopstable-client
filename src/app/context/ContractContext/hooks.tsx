// import { useUser } from "@/app/context/UserContext/UserContext";
import { ContractContext } from "@/app/context/ContractContext/ContractContext";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SignTransaction } from "@stellar/stellar-sdk/contract";
import { chainConfig } from "@/app/config";
import { UserContextStateConnected } from "../UserContext/types";
import { NetworkString } from "@/app/services/UserService/types";

export function useAllowance(account: string, network: NetworkString) {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useAllowance must be used within a ContractProvider");

  return useQuery({
    queryKey: [`allowance_${account}`],
    queryFn: async () => {
      // TODO fetch allowance transaction
      return context.usdc.fetchAllowance(
        account,
        chainConfig[network].yieldController.contractId,
        network,
      );
    },
    refetchInterval: 5000,
  });
}

export function useTokenMint(signTransaction: SignTransaction) {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useTokenMint must be used within a ContractProvider");

  const [state, setState] = useState<
    { status: "init" } | { status: "success" } | { status: "error" }
  >({ status: "init" });

  async function signAndSend(
    user: UserContextStateConnected,
    sequenceNumber: string,
    amount: bigint,
  ) {
    context?.yieldController
      .mint(user.account, sequenceNumber, amount, user.network, signTransaction)
      .then(() => {
        setState({ status: "success" });
      })
      .catch((err) => {
        console.log(err);
        setState({ status: "error" });
      });
  }

  return { state, signAndSend };
}

export function useTokenBurn(signTransaction: SignTransaction) {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useTokenABalance must be used within a ContractProvider");

  const [state, setState] = useState<
    { status: "init" } | { status: "success" } | { status: "error" }
  >({ status: "init" });

  async function signAndSend(user: UserContextStateConnected, amount: bigint) {
    // TODO burn transaction
    context?.yieldController
      .burn(user.account, amount, user.network, signTransaction)
      .then(() => {
        setState({ status: "success" });
      })
      .catch((err) => {
        console.log(err);
        setState({ status: "error" });
      });
  }

  return { state, signAndSend };
}
