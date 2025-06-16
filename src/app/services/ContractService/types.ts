export type ContractService = {
    yieldController: IYieldControllerService;
    yieldDistributor: IYieldDistributorService;
}

export interface IYieldControllerService {
    mintCUSD: (amount: number) => Promise<string | undefined>;  
    burnCUSD: (amount: number) => Promise<string | undefined>; 
    getYield: () => Promise<string | undefined>;
}

export interface IYieldDistributorService {
    isDistributionAvailable: () => Promise<boolean | undefined>; 
    getDistributionPeriod: () => Promise<string | undefined>;
    getNextDistributionTime: () => Promise<string | undefined>;
}

export enum SupportedProtocols {
    BlendProtocol = "BC_LA",
}