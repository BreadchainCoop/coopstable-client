import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractContext } from "./ContractContext";
import { QUERY_KEYS } from "@/app/constants";

export function useMintCUSD(setTxLink: (txLink: string) => void) {
  const context = useContext(ContractContext);
  const queryClient = useQueryClient();
  if (!context)
    throw new Error("useMintCUSD must be used within a ContractContext");
  
  return useMutation<string | undefined, Error, number>({
    mutationFn: context.yieldController.mintCUSD,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BALANCES })
      setTxLink(data as string);
    }
  });
}

export function useBurnCUSD(setTxLink: (txLink: string) => void) {
  const context = useContext(ContractContext);
  const queryClient = useQueryClient();
  if (!context)
    throw new Error("useBurnCUSD must be used within a ContractContext");
  
  return useMutation<string | undefined, Error, number>({
    mutationFn: context.yieldController.burnCUSD,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BALANCES })
      setTxLink(data as string);
    },
  });
}
