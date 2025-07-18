import Link from "next/link";
import  { MemberInfo } from "../types";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { getExplorerLinkForAddress } from "@/app/utils/address";
import { Network } from "@/app/config";

type MemberInfoCardProps = {
    member: MemberInfo;
    network: Network;
}
export function MemberInfoCard({
    member,
    network
}: Readonly<MemberInfoCardProps>) {
    return (
        <div className="bg-theme-grey-1 border-1 border-theme-grey-7 p-4">
            <div className="flex flex-col gap-2">
                <h2 className="font-extrabold text-2xl text-theme-grey-8 font-theme-3 italic">{member.name}</h2>
                <p className="text-[16px] text-theme-grey-6 font-theme-1 italic wrap-normal">{member.description}</p>
                <div className="flex justify-between items-center py-4 lg:justify-start lg:gap-4">
                    <Link 
                        href={getExplorerLinkForAddress(member.treasury, network)}  
                        className="flex items-center gap-2 text-black text-[16px] font-theme-1 font-extrabold"
                        target="_blank"
                        >
                        <span>Project Treasury</span>
                        <div className="size-7 h-fit"> 
                            <ExternalLinkIcon stroke="currentColor"/>
                        </div>
                    </Link>
                    <Link 
                        href={member.website} 
                        className="flex items-center gap-2 text-black text-[16px] font-theme-1 font-extrabold"
                        target="_blank"
                        >
                        <span>Website</span>
                        <div className="size-7 h-fit"> 
                            <ExternalLinkIcon stroke="currentColor"/>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col font-theme-">
                <span className="text-theme-grey-5">Share of monthly yield</span>
                <div className="flex">
                    <span className="font-extrabold text-theme-grey-8 text-[16px]">{member.shareOfYield}</span>
                    <span className="px-2 font-extrabold">|</span>
                    <span className="text-theme-grey-6 text-[16px]">{member.percentageOfYield} %</span>
                </div>
            </div>
        </div>
    );
}
