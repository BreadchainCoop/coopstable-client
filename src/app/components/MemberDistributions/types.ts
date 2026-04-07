import { ReactNode } from "react";

export type MemberInfo = {
    name: string;
    description: string;
    shareOfYield: ReactNode;
    percentageOfYield: string;
    treasury: string;
    website: string;
}