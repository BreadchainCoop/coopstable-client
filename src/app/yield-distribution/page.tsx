import YieldDistributionInfo from "../components/YieldDistributionInfo";

// TODO: Add the popover
export default function YieldDistributionPage() {
  return (
    <main>
        <YieldDistributionInfo />
        {/* progress bar */}
        {/* member info */}
    </main>
  )
}

export function LabelValueHorizonal({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex w-full justify-between">
            <span className="text-theme-grey-6 text-[16px]">{label}</span>
            <span className="font-bold text-[16px] text-black">{value}</span>
        </div>
    )
}