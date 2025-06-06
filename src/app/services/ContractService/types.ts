export type ContractService = {
    yieldController: IYieldControllerService;
}

export interface IYieldControllerService {
    mintCUSD: (amount: number) => Promise<string | undefined>;  
    burnCUSD: (amount: number) => Promise<string | undefined>; 
}