import { CUSDIcon } from "../Icons";
import { useGetCUSDTotalSupply, useGetTotalDistributed } from "@/app/context/ContractContext/hooks";
import { FormattedCUSD } from "@/app/components/FormattedCUSD";

interface StatItemProps {
  readonly label: string;
  readonly value: React.ReactNode;
  readonly icon?: React.ReactNode;
}

function StatItem({ label, value, icon }: StatItemProps) {
  return (
    <div className="bg-theme-grey-1 border-theme-grey-4 border-1 p-4 flex-row items-center space-y-2 lg:p-4 lg:w-4/12">
      {/* mobile */}
      <span className="md:hidden text-[20px] font-medium text-gray-700">{label}</span> 
      <div className={`md:hidden flex items-center ${icon ? "gap-3" : ""}`}>
        { 
            icon && 
            <div className="w-6 h-6 flex lg:w-8 lg:h-8 items-center justify-center">
            {icon}
            </div>
        }
        <span className="font-bold text-lg text-black">{value}</span>
      </div>
      
      <span className="hidden md:block text-sm font-medium text-gray-700">{label}</span>
      <div className={`hidden md:flex items-center ${icon ? "gap-3" : ""}`}>
        { 
          icon && 
          <div className="w-8 h-8 items-center justify-center">
          {icon}
          </div>
        }
        <span className="font-bold text-lg text-black">{value}</span>
      </div>
    </div>
  );
}

export function StatsPanel() {
  const { data: totalDistributed } = useGetTotalDistributed();
  const { data: cusdData } = useGetCUSDTotalSupply();
  return (
    <div className="w-[95%] max-w-md lg:max-w-[unset] lg:justify-between mx-auto mt-[-3rem] lg:mt-[-1.5rem]">
      <div className="space-y-3 lg:space-y-0 lg:space-x-3 lg:flex lg:justify-between"> 
        <StatItem
          label="Total minted cUSD"
          value={<FormattedCUSD stroops={cusdData ?? 0} />}
          icon={<CUSDIcon />}
        />
        <StatItem
          label="Total yield generated overtime"
          value={<FormattedCUSD stroops={totalDistributed ?? 0} />}
          icon={<CUSDIcon />}
        />
        <StatItem
          label="Total projects funded"
          value="0"
        />
      </div>
    </div>
  );
}