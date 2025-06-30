import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useGetYield() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useGetYield must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.YIELD,
    queryFn: context.yieldController.getYield,
    refetchInterval: 3000,
    refetchOnWindowFocus: false,
  });
}

export function useIsDistributionAvailable() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useIsDistributionAvailable must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.IS_DISTRIBUTION_AVAILABLE,
    queryFn: context.yieldDistributor.isDistributionAvailable,
    refetchOnWindowFocus: true,
  });
}

export function useGetDistributionPeriod() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useGetDistributionPeriod must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.DISTRIBUTION_PERIOD,
    queryFn: context.yieldDistributor.getDistributionPeriod,
    refetchInterval: 3000,
    refetchOnWindowFocus: false,
  });
}

export function useGetNextDistributionTime() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useGetNextDistributionTime must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.NEXT_DISTRIBUTION_TIME,
    queryFn: context.yieldDistributor.getNextDistributionTime,
    refetchInterval: 3000,
    refetchOnWindowFocus: false,
  });
}

export function useGetCUSDTotalSupply() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useGetCusdTotalSupply must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.CUSD_TOTAL_SUPPLY,
    queryFn: context.cusdManager.getTotalSupply,
    refetchInterval: 3000,
    refetchOnWindowFocus: false,
  });
}