import { cn, pageWrapClasses } from "@/app/utils";
import { CUSDIcon } from "@/app/components/Icons";
import { DistributionInfoCircleWithPopOver } from "./DistributionInfoCircleWithPopOver";

export default function YieldDistributionInfo() {
    const coreTeamYield = "2000.56";
    const cohortYield = "18000.56";

    return (
        <section className={cn(pageWrapClasses, 'px-[unset] py-[1.5rem]')}>
            <div className="p-4 lg:py-6 grid grid-cols-1 items-center gap-6 lg:gap-4 lg:grid-cols-2 lg:px-4 hero-bg">
                <div className="text-center bg-theme-grey-1 border-1 border-opacity-50 border-theme-grey-7 py-4 px-8 space-y-2">
                    <h1 className="font-theme-2 text-center text-3xl leading-tight font-extrabold tracking-wider text-theme-grey-6">
                        Total yield to distribute
                    </h1>
                    <div className="w-full flex justify-center items-center gap-3 mb-2">
                        <div className="w-6 h-6 flex lg:w-8 lg:h-8 items-center justify-center">
                            <CUSDIcon />
                        </div>
                        <span className="text-[2rem] font-bold text-lg text-black">20,000.56 cUSD</span>
                    </div>
                    <div className="flex justify-center items-center gap-2 ">
                        <span className="text-[14px] leading-[1.2]">Yield breakdown</span>
                        <DistributionInfoCircleWithPopOver coreTeamYield={coreTeamYield} cohortYield={cohortYield} /> 
                    </div>
                </div>
                <div className="bg-theme-grey-1 border-1 border-opacity-50 border-theme-grey-7 flex flex-col w-full py-4 px-8 space-y-2.5"> 
                    <LabelValueHorizonal label={"APY"} value={"20%"} />    
                    <LabelValueHorizonal label={"Cohort size"} value={"5"} />    
                    <LabelValueHorizonal label={"Est. yield per project"} value={"$4,000.56"} />    
                    <LabelValueHorizonal label={"Distribution round"} value={"2"} />    
                </div>
            </div>
        </section>
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