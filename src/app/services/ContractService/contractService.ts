import { chainConfig } from "../../config";
import { fetchAllowance } from "./token";
import { type ContractService } from "./types";
import { deposit_collateral, withdraw_collateral } from "./yield_controller";

export const contractService: ContractService = {
  contracts: {
    yieldController: {
      mint: async (
        account, 
        sequenceNumber, 
        amount, 
        network, 
        signTransaction
      ) => deposit_collateral(account, amount, network, sequenceNumber, signTransaction),
      
      burn: async (
        account, 
        amount, 
        network, 
        signTransaction
      ) => withdraw_collateral(account, amount, network, signTransaction),
    },
  },
  sacs: {
    usdc: {
      fetchAllowance: (owner, spender, network) => 
        fetchAllowance(owner, spender, chainConfig[network].usdc.contractId, network),
    },
    cusd: {
      fetchAllowance: (owner, spender, network) => 
        fetchAllowance(owner, spender, chainConfig[network].cusd.contractId, network),
    },
  }  
};