import { Network } from "@/app/config";
import { SignTransaction } from "@stellar/stellar-sdk/contract";

export type ContractService = {
    contracts: { 
      yieldController: {
        mint: (
          account: string,
          sequenceNumber: string,
          amount: bigint,
          network: Network,
          signTransaction: SignTransaction,
        ) => Promise<bigint>;
        burn: (
          account: string,
          amount: bigint,
          network: Network,
          signTransaction: SignTransaction,
        ) => Promise<bigint>;
      };
    };
    sacs: {
      usdc: {
        fetchAllowance: (
          owner: string,
          spender: string,
          network: Network,
        ) => Promise<number | null>;
        // approve: (
        //   owner: string,
        //   spender: string,
        //   amount: bigint,
        //   expiration: number,
        //   network: Network,
        // ) => Promise<boolean>;
      }
      cusd: {
        fetchAllowance: (
          owner: string,
          spender: string,
          network: Network,
        ) => Promise<number | null>;
        // approve: (
        //   owner: string,
        //   spender: string,
        //   amount: bigint,
        //   expiration: number,
        //   network: Network,
        // ) => Promise<boolean>;      
      }
    }
  };