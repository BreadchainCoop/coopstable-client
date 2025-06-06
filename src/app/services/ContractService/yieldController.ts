import { rpc } from '@stellar/stellar-sdk';
import { Network, NetworkConfig, getNetworkConfig } from '@/app/config';
import { getYieldControllerClient } from '@/app/contracts'; 
import { IYieldControllerService } from './types';
import { SignTransaction } from '@stellar/stellar-sdk/contract';
import { toBigInt } from '@/app/utils/tokenFormatting';

export class YieldControllerService implements IYieldControllerService {
    private config: NetworkConfig;
    private walletAddress: string;
    constructor(
      network: Network,
      walletAddress: string,
      private signTransaction: SignTransaction,
    ) {
      this.walletAddress = walletAddress;
      this.config = getNetworkConfig(network);
      this.mintCUSD = this.mintCUSD.bind(this);
      this.burnCUSD = this.burnCUSD.bind(this);
    }
    
    async mintCUSD(amount: number): Promise<string | undefined> {
      const yieldController = getYieldControllerClient(this.config.network, this.walletAddress);
      const depositOp = await yieldController.deposit_collateral({
        protocol: "BC_LA",
        user: this.walletAddress,
        asset: this.config.usdc.contractId,
        amount: toBigInt(amount),
      }, {
        simulate: true
      });
      if (depositOp.simulation) {
        if(rpc.Api.isSimulationError(depositOp.simulation)) throw new Error(depositOp.simulation.error);
        if (rpc.Api.isSimulationRestore(depositOp.simulation)) {
          await depositOp.restoreFootprint(depositOp.simulation.restorePreamble);
          let hash = await this.mintCUSD(amount);
          return hash;
        }
        if (rpc.Api.isSimulationSuccess(depositOp.simulation)) {
          let response = await depositOp.signAndSend({ signTransaction: this.signTransaction });
          return response.sendTransactionResponse?.hash;
        }
      }  
      return;
    }
  
    async burnCUSD(amount: number): Promise<string | undefined > { 
      const yieldController = getYieldControllerClient(this.config.network, this.walletAddress);
      const withdrawOp = await yieldController.withdraw_collateral({
        protocol: "BC_LA",
        user: this.walletAddress,
        asset: this.config.usdc.contractId,
        amount: toBigInt(amount),
      }, {
        simulate: true
      });
      if (withdrawOp.simulation) {
        if(rpc.Api.isSimulationError(withdrawOp.simulation)) throw new Error(withdrawOp.simulation.error);
        if (rpc.Api.isSimulationRestore(withdrawOp.simulation)) {
          await withdrawOp.restoreFootprint(withdrawOp.simulation.restorePreamble);
          let hash = await this.burnCUSD(amount);
          return hash;
        }
        if (rpc.Api.isSimulationSuccess(withdrawOp.simulation)) {
          let response = await withdrawOp.signAndSend({ signTransaction: this.signTransaction })
          return response.sendTransactionResponse?.hash;
        };
      }  
      return;
    }
  }
  

  



