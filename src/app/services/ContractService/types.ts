export type ContractService = {
    yieldController: IYieldControllerService;
    yieldDistributor: IYieldDistributorService;
    cusdManager: ICusdManagerService;
}

export interface IYieldControllerService {
    mintCUSD: (amount: number) => Promise<string | undefined>;  
    burnCUSD: (amount: number) => Promise<string | undefined>; 
    getYield: () => Promise<string | undefined>;
    getTotalAPY: () => Promise<number | undefined>;
}

export interface ICusdService {
    totalSupply: () => Promise<string | undefined>;  
}

export interface ICusdManagerService {
    getTotalSupply: () => Promise<string | undefined>;  
}

export interface IYieldDistributorService {
    isDistributionAvailable: () => Promise<boolean | undefined>;
    getDistributionPeriod: () => Promise<string | undefined>;
    getNextDistributionTime: () => Promise<string | undefined>;
    getTotalMembers: () => Promise<number | undefined>;
    getTreasuryShare: () => Promise<number | undefined>;
    timeBeforeNextDistribution: () => Promise<number | undefined>;
    getDistributionRound: () => Promise<number | undefined>;
    getTotalDistributed: () => Promise<string | undefined>;
}

export enum SupportedProtocols {
    BlendProtocol = "BC_LA",
}