"use client";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/app/utils";

// Mock data - replace with actual API calls
const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: async () => ({
      totalMintedCUSD: "100.78",
      totalYieldGenerated: "10.78", 
      totalProjectsFunded: 0
    })
  });
};

export function StatisticsPanel() {
  const { data: stats, isLoading } = useStatistics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCard key={i} loading />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Total minted cUSD"
        value={stats?.totalMintedCUSD || "0"}
        icon="💰"
        trend={{ value: "+12%", isPositive: true }}
      />
      <StatCard
        title="Total yield generated overtime"
        value={stats?.totalYieldGenerated || "0"}
        icon="📈"
        trend={{ value: "+5.2%", isPositive: true }}
      />
      <StatCard
        title="Total projects funded"
        value={stats?.totalProjectsFunded?.toString() || "0"}
        icon="🚀"
      />
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  loading = false 
}: {
  title?: string;
  value?: string;
  icon?: string;
  trend?: { value: string; isPositive: boolean };
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="border border-[#B1AEAB] bg-white p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#B1AEAB] bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#7A7A7A] font-medium">{title}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl">{icon}</span>
            <span className="text-3xl font-bold text-black">{value}</span>
          </div>
          {trend && (
            <div className="mt-2">
              <span className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.value}
              </span>
              <span className="text-xs text-[#7A7A7A] ml-1">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}