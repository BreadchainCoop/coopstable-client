import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/app/context/UserContext/UserContext"; 
import { ContractContext } from "./ContractContext";
import { QUERY_KEYS } from "@/app/constants";

export function useMintCUSD() {
  const context = useContext(ContractContext);
  const queryClient = useQueryClient();
  if (!context)
    throw new Error("useMintCUSD must be used within a ContractContext");
  
  const { signTransaction, user } = useUser();
  if (user.status !== "connected") throw new Error("User not connected");

  let yieldControllerContract = context.yieldController(user.network, user.account, signTransaction);
  return useMutation<void, Error, number>({
    mutationFn: yieldControllerContract.mintCUSD,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BALANCES }),
  });
}

export function useBurnCUSD() {
  const context = useContext(ContractContext);
  const queryClient = useQueryClient();
  if (!context)
    throw new Error("useBurnCUSD must be used within a ContractContext");
  
  const { signTransaction, user } = useUser();
  if (user.status !== "connected") throw new Error("User not connected");

  let yieldControllerContract = context.yieldController(user.network, user.account, signTransaction);
  return useMutation<void, Error, number>({
    mutationFn: yieldControllerContract.burnCUSD,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BALANCES }),
  });
}

// fetch yield
