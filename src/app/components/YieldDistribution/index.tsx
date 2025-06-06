"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/app/components/Button";

// Mock data - replace with actual API calls
const useYieldData = () => {
  return useQuery({
    queryKey: ['yield-data'],
    queryFn: async () => ({
      currentYield: "2.45",
      nextDistribution: "2024-12-25",
      totalMembers: 156,
      lastDistribution: {
        amount: "1,234.56",
        date: "2024-11-25",
        recipients: 142
      }
    })
  });
};

const useDistributionHistory = () => {
  return useQuery({
    queryKey: ['distribution-history'],
    queryFn: async () => [
      { date: "Nov 2024", amount: "1,234.56", recipients: 142 },
      { date: "Oct 2024", amount: "987.32", recipients: 138 },
      { date: "Sep 2024", amount: "2,145.89", recipients: 134 },
      { date: "Aug 2024", amount: "1,567.23", recipients: 129 }
    ]
  });
};

export function YieldDistribution() {
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  const { data: yieldData, isLoading } = useYieldData();
  const { data: history } = useDistributionHistory();

  if (isLoading) {
    return (
      <div className="border border-[#B1AEAB] bg-white p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="font-theme-2 text-4xl font-bold text-black mb-4">
          Yield Distribution
        </h2>
        <p className="text-lg text-[#7A7A7A] max-w-2xl mx-auto">
          Track how yields are distributed to support Stellar ecosystem projects
        </p>
      </div>

      <div className="border border-[#B1AEAB] bg-white">
        {/* Tab Navigation */}
        <div className="border-b border-[#B1AEAB] px-8 pt-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "overview"
                  ? "border-black text-black"
                  : "border-transparent text-[#7A7A7A] hover:text-black"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "history"
                  ? "border-black text-black"
                  : "border-transparent text-[#7A7A7A] hover:text-black"
              }`}
            >
              Distribution History
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Current Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Current Yield"
                  value={`${yieldData?.currentYield || "0"}%`}
                  subtitle="Annual percentage yield"
                  icon="📊"
                />
                <MetricCard
                  title="Active Members"
                  value={yieldData?.totalMembers?.toString() || "0"}
                  subtitle="Projects receiving funding"
                  icon="👥"
                />
                <MetricCard
                  title="Next Distribution"
                  value={yieldData?.nextDistribution || "TBD"}
                  subtitle="Scheduled payout date"
                  icon="📅"
                />
              </div>

              {/* Last Distribution */}
              <div className="bg-[#F7F6F3] border border-[#B1AEAB] p-6 rounded">
                <h3 className="font-bold text-black mb-4">Last Distribution</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-[#7A7A7A]">Amount Distributed</p>
                    <p className="text-xl font-bold text-black">
                      ${yieldData?.lastDistribution.amount || "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7A7A7A]">Recipients</p>
                    <p className="text-xl font-bold text-black">
                      {yieldData?.lastDistribution.recipients || 0} projects
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7A7A7A]">Date</p>
                    <p className="text-xl font-bold text-black">
                      {yieldData?.lastDistribution.date || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Button variant="secondary">
                  View Distribution Details
                </Button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#B1AEAB]">
                      <th className="text-left py-3 text-sm font-medium text-[#7A7A7A]">
                        Month
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-[#7A7A7A]">
                        Amount Distributed
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-[#7A7A7A]">
                        Recipients
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-[#7A7A7A]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history?.map((item, index) => (
                      <tr key={index} className="border-b border-[#F2F2F2]">
                        <td className="py-4 font-medium text-black">
                          {item.date}
                        </td>
                        <td className="py-4 text-black">
                          ${item.amount}
                        </td>
                        <td className="py-4 text-black">
                          {item.recipients} projects
                        </td>
                        <td className="py-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="text-center p-6 bg-[#F7F6F3] border border-[#B1AEAB] rounded">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-bold text-black mb-1">{title}</h3>
      <div className="text-2xl font-bold text-black mb-1">{value}</div>
      <p className="text-sm text-[#7A7A7A]">{subtitle}</p>
    </div>
  );
}