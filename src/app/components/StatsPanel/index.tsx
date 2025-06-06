import { CUSDIcon } from "../Icons";

interface StatItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function StatItem({ label, value, icon }: StatItemProps) {
  return (
    <div className="bg-[#F7F6F3] border-[#B1AEAB] border-1 p-4 flex-row items-center justify-between space-y-2">
      <div className={`flex items-center ${icon ? "gap-3" : ""}`}>
        { 
            icon && 
            <div className="w-6 h-6 flex items-center justify-center">
            {icon}
            </div>
        }
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <span className="font-bold text-lg text-black">{value}</span>
    </div>
  );
}

export function StatsPanel() {
  return (
    <div className="w-[95%] max-w-md mx-auto mt-[-1rem] md:hidden">
      <div className="space-y-3">
        <StatItem
          label="Total minted cUSD"
          value="100.78"
          icon={<CUSDIcon />}
        />
        <StatItem
          label="Total yield generated overtime"
          value="10.78"
          icon={<CUSDIcon />}
        />
        <StatItem
          label="Total projects funded"
          value="0"
        //   icon={<></>}
        />
      </div>
    </div>
  );
}