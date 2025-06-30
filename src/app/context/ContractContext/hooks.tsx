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
    refetchInterval: 3000,
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
    refetchInterval: 3000,
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
        cohortYield: "0", 
        treasuryYield: "0",
        totalMembers: "0",
      };
    }
    
    // Convert to BigInt for precise calculations
    const totalYieldBig = BigInt(totalYield);
    const treasuryShareBig = BigInt(treasuryShare);
    const totalMembersBig = BigInt(totalMembers);
    
    // Assuming treasuryShare is in basis points (0-10000)
    // Divide by 10000 to get the actual fraction
    const BASIS_POINTS = BigInt(10000);
    const treasuryYield = (totalYieldBig * treasuryShareBig) / BASIS_POINTS;
    
    // Calculate remaining yield for cohort
    const remainingYield = totalYieldBig - treasuryYield;
    
    // Calculate per-member yield if there are members
    const cohortYield = totalMembersBig > BigInt(0) 
      ? remainingYield / totalMembersBig 
      : BigInt(0);
    
    return {
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

export function useCalculateAPY() {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error("useCalculateAPY must be used within a ContractContext");
  
  const { data: totalYield } = useGetYield();
  const { data: cusdTotalSupply } = useGetCUSDTotalSupply();
  const { data: distributionPeriod } = useGetDistributionPeriod();
  
  return useMemo(() => {
    // Return 0 if we don't have all required data
    if (!totalYield || !cusdTotalSupply || !distributionPeriod) {
      return {
        apy: "0",
        apyPercentage: "0.00",
        dailyRate: "0",
        monthlyRate: "0",
        projectedAnnualYield: "0"
      };
    }
    
    // Convert to BigInt for precise calculations
    const totalYieldBig = BigInt(totalYield);
    const totalSupplyBig = BigInt(cusdTotalSupply);
    const distributionPeriodBig = BigInt(distributionPeriod);
    
    // Prevent division by zero
    if (totalSupplyBig === BigInt(0) || distributionPeriodBig === BigInt(0)) {
      return {
        apy: "0",
        apyPercentage: "0.00",
        dailyRate: "0",
        monthlyRate: "0",
        projectedAnnualYield: "0"
      };
    }
    
    // Constants for time calculations (assuming distributionPeriod is in seconds)
    const SECONDS_PER_DAY = BigInt(86400);
    const DAYS_PER_YEAR =  BigInt(365);
    const DAYS_PER_MONTH = BigInt(30);
    const SECONDS_PER_YEAR = SECONDS_PER_DAY * DAYS_PER_YEAR;
    
    // Calculate the yield rate for the distribution period
    // yieldRate = totalYield / totalSupply
    const PRECISION = BigInt(1000000); // Use 6 decimal places for precision
    const yieldRate = (totalYieldBig * PRECISION) / totalSupplyBig;
    
    // Calculate periods per year
    const periodsPerYear = SECONDS_PER_YEAR / distributionPeriodBig;
    
    // Calculate APY using compound interest formula
    // APY = (1 + yieldRate)^periodsPerYear - 1
    // Since we can't do exponentiation with BigInt easily, we'll use simple interest approximation
    // For small rates, this is reasonably accurate
    const simpleAnnualRate = (yieldRate * periodsPerYear) / PRECISION;
    
    // Calculate daily and monthly rates
    const dailyRate = (yieldRate * SECONDS_PER_DAY) / (distributionPeriodBig * PRECISION);
    const monthlyRate = (dailyRate * DAYS_PER_MONTH);
    
    // Calculate projected annual yield based on current supply
    const projectedAnnualYield = (totalSupplyBig * simpleAnnualRate) / BigInt(100);
    
    // Convert to percentage (multiply by 100)
    const apyPercentage = simpleAnnualRate;
    
    // Format the percentage to 2 decimal places
    const apyPercentageFormatted = (Number(apyPercentage) / 1).toFixed(2);
    
    return {
      apy: simpleAnnualRate.toString(),
      apyPercentage: apyPercentageFormatted,
      dailyRate: dailyRate.toString(),
      monthlyRate: monthlyRate.toString(),
      projectedAnnualYield: projectedAnnualYield.toString()
    };
  }, [totalYield, cusdTotalSupply, distributionPeriod]);
}

// Helper hook to get formatted APY display
export function useFormattedAPY() {
  const { apyPercentage, dailyRate, monthlyRate } = useCalculateAPY();
  
  return useMemo(() => {
    return {
      annual: `${apyPercentage}%`,
      monthly: `${(Number(monthlyRate) / 100).toFixed(4)}%`,
      daily: `${(Number(dailyRate) / 100).toFixed(6)}%`
    };
  }, [apyPercentage, dailyRate, monthlyRate]);
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