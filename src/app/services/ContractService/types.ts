export type ContractService = {
    yieldController: IYieldControllerContract;
}

export interface IYieldControllerContract {
    mintCUSD: (amount: number) => Promise<void>;  
    burnCUSD: (amount: number) => Promise<void>; 
}