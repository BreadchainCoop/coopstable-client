import { InfoCircledIcon } from "@radix-ui/react-icons";

import { cn, pageWrapClasses } from "@/app/utils";
import { CUSDIcon } from "@/app/components/Icons";
import { DistributionInfoCircleWithPopOver } from "./DistributionInfoCircleWithPopOver";


// TODO: Add the dialog pupup
export default function YieldDistributionInfo() {

    return (
        <section className={cn(pageWrapClasses, 'px-[unset] py-[1.5rem]')}>
            <div className="p-4 lg:py-[10rem] grid grid-cols-1 items-center gap-6 lg:gap-12 lg:grid-cols-2 lg:px-20 hero-bg">
                <div className="text-center bg-theme-grey-1 border-1 border-opacity-50 border-theme-grey-7 p-[1rem] space-y-2">
                    <h1 className="font-theme-2 text-center text-3xl leading-tight font-extrabold tracking-wider text-theme-grey-6 lg:text-6xl">
                        Total yield to distribute
                    </h1>
                    <div className="w-full md:hidden flex justify-center items-center gap-3 mb-2">
                        <div className="w-6 h-6 flex lg:w-8 lg:h-8 items-center justify-center">
                            <CUSDIcon />
                        </div>
                        <span className="text-[2rem] font-bold text-lg text-black">20,000.56 cUSD</span>
                    </div>
                    <div className="flex justify-center items-center gap-2 h-fit">
                        <span className="text-[14px] leading-[1.2]">Yield breakdown</span>
                        <DistributionInfoCircleWithPopOver />
                    </div>
                </div>
                <div className="bg-theme-grey-1 border-1 border-opacity-50 border-theme-grey-7 flex flex-col w-full p-[1rem] space-y-4"> 
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