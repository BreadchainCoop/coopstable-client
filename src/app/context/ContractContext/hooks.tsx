import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractContext } from "./ContractContext";
import { QUERY_KEYS } from "@/app/constants";

export function useMintCUSD() {
  const context = useContext(ContractContext);
  const queryClient = useQueryClient();
  if (!context)
    throw new Error("useMintCUSD must be used within a ContractContext");
  
  return useMutation<void, Error, number>({
    mutationFn: context.yieldController.mintCUSD,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BALANCES }),
  });
}

export function useBurnCUSD() {
  const context = useContext(ContractContext);
  const queryClient = useQueryClient();
  if (!context)
    throw new Error("useBurnCUSD must be used within a ContractContext");
  
  return useMutation<void, Error, number>({
    mutationFn: context.yieldController.burnCUSD,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BALANCES }),
  });
}
