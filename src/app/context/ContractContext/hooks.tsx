import { useContext, useMemo } from "react";
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

export function useGetTotalMembers() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useGetTotalMembers must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.TOTAL_MEMBERS,
    queryFn: context.yieldDistributor.getTotalMembers,
    refetchOnWindowFocus: false,
  });
}

export function useGetTotalDistributed() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useGetTotalDistributed must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.TOTAL_DISTRIBUTED,
    queryFn: context.yieldDistributor.getTotalDistributed,
    refetchOnWindowFocus: false,
    refetchInterval: 3000,
  });
}

export function useGetTotalAPY() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useGetTotalAPY must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.TOTAL_APY,
    queryFn: context.yieldController.getTotalAPY,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  });
}

export function useGetTreasuryShare() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useGetTreasuryShare must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.TREASURY_SHARE,
    queryFn: context.yieldDistributor.getTreasuryShare,
    refetchOnWindowFocus: false,
  });
}

export function useGetYield() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useGetYield must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.YIELD,
    queryFn: context.yieldController.getYield,
    refetchOnWindowFocus: false,
    refetchInterval: 3000,
  });
}

export function useYieldData() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useYieldData must be used within a ContractContext");
  
  const { data: totalMembers } = useGetTotalMembers();
  const { data: treasuryShare } = useGetTreasuryShare();
  const { data: totalYield } = useGetYield();
  
  return useMemo(() => {
    if (!totalMembers || !totalYield || treasuryShare === undefined) {
      return { 
        totalYield: "0",
        cohortYield: "0", 
        treasuryYield: "0",
        totalMembers: "0",
      };
    }
    const totalYieldBig = BigInt(totalYield);
    const treasuryShareBig = BigInt(treasuryShare);
    const totalMembersBig = BigInt(totalMembers);
    const BASIS_POINTS = BigInt(10000);
    const treasuryYield = (totalYieldBig * treasuryShareBig) / BASIS_POINTS;
    const remainingYield = totalYieldBig - treasuryYield;
    
    const cohortYield = totalMembersBig > BigInt(0) 
      ? remainingYield / totalMembersBig 
      : BigInt(0);
    
    return {
      totalYield: totalYield.toString(),
      cohortYield: cohortYield.toString(),
      treasuryYield: treasuryYield.toString(),
      totalMembers: totalMembersBig.toString(),
    };
  }, [totalYield, totalMembers, treasuryShare]);
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

export function useGetDistributionRound() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useGetDistributionRound must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.DISTRIBUTION_ROUND,
    queryFn: context.yieldDistributor.getDistributionRound,
    refetchOnWindowFocus: false,
  });
}

export function useTimeBeforeNextDistribution() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useTimeBeforeNextDistribution must be used within a ContractContext");
  
  return useQuery({
    queryKey: QUERY_KEYS.NEXT_DISTRIBUTION_TIME,
    queryFn: context.yieldDistributor.timeBeforeNextDistribution,
    refetchInterval: 1000,
    refetchOnWindowFocus: false,
  });
}