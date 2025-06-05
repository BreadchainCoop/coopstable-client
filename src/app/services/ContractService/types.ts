import { Network } from "@/app/config";
import { SignTransaction } from "@stellar/stellar-sdk/contract";

export type ContractService = {
    yieldController: (
        network: Network,
        walletAddress: string,
        signTransaction: SignTransaction
    ) => IYieldControllerContract;
}

export interface IYieldControllerContract {
    mintCUSD: (amount: number) => Promise<void>;  
    burnCUSD: (amount: number) => Promise<void>; 
}