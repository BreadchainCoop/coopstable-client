'use client';
import { cn, pageWrapClasses } from "@/app/utils";
import { FormattedCUSD } from "@/app/components/FormattedCUSD";
import { DistributionProgressBar } from "./components/DistributionProgressBar";
import { MEMBER_INFO } from "./constants";
import { MemberInfoCard } from "./components/MemberInfoCard";
import { DEFAULT_NETWORK } from "@/app/config";
import { useYieldData } from "@/app/context/ContractContext/hooks";

function MemberDistributions() {
    const network = DEFAULT_NETWORK;
    const {
        memberYieldPercentage,
        cohortYield,
    } = useYieldData();
    return ( 
        <section className={cn(pageWrapClasses, 'space-y-6 y-2')}>
            <DistributionProgressBar />
            <div className="flex flex-col gap-3">
            {
                MEMBER_INFO.map(m => ({ 
                    ...m, 
                    percentageOfYield: Number.parseFloat((memberYieldPercentage ?? 0).toString()).toFixed(2),
                    shareOfYield: <FormattedCUSD stroops={cohortYield} />,
                })).map((member) => <MemberInfoCard key={member.treasury} member={member} network={network} />)  
            }   
            </div>
        </section>
    );
}

export default MemberDistributions;