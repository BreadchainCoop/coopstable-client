import { cn, pageWrapClasses } from "@/app/utils";
import { DistributionProgressBar } from "./components/DistributionProgressBar";
import { MEMBER_INFO } from "./constants";
import { MemberInfoCard } from "./components/MemberInfoCard";
import { SUPPORTED_NETWORKS } from "@/app/config";

function MemberDistributions() {
    const network = SUPPORTED_NETWORKS.TESTNET;
    return ( 
        <section className={cn(pageWrapClasses, 'space-y-6 y-2')}>
            <DistributionProgressBar />
            <div className="flex flex-col gap-3">
            {
                MEMBER_INFO.map((member) => <MemberInfoCard key={member.treasury} member={member} network={network} />)
            }   
            </div>
        </section>
    );
}

export default MemberDistributions;