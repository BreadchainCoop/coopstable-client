import { DEFAULT_NETWORK, Network, NetworkConfig, getNetworkConfig } from '@/app/config';
import { getYieldControllerClient } from '@/app/contracts';
import { rpc } from '@/packages/lending_yield_controller/src/index'; 
import { IYieldControllerService, SupportedProtocols } from './types';
import { SignTransaction } from '@stellar/stellar-sdk/contract';
import { toBigInt } from '@/app/utils/tokenFormatting';

export class YieldControllerService implements IYieldControllerService {
    private readonly network: Network;
    private readonly config: NetworkConfig;
    private readonly walletAddress?: string;
    private readonly signTransaction?: SignTransaction;

    constructor(
      network?: Network,
      walletAddress?: string,
      signTransaction?: SignTransaction,
    ) {
      this.network = network ?? DEFAULT_NETWORK;
      this.config = getNetworkConfig(this.network);
      this.walletAddress = walletAddress;
      this.signTransaction = signTransaction;
      this.mintCUSD = this.mintCUSD.bind(this);
      this.burnCUSD = this.burnCUSD.bind(this);
      this.getYield = this.getYield.bind(this);
      this.getTotalAPY = this.getTotalAPY.bind(this);
    }
    
    async mintCUSD(amount: number): Promise<string | undefined> {
      if (!this.walletAddress || !this.signTransaction) {
        throw new Error('Wallet connection required for mint operation');
      }
      const yieldController = getYieldControllerClient(this.network, this.walletAddress);
      const depositOp = await yieldController.deposit_collateral({
        protocol: SupportedProtocols.BlendProtocol,
        user: this.walletAddress,
        asset: this.config.usdc.contractId,
        amount: toBigInt(amount),
      }, {
        simulate: true
      });
      
      const simulation = depositOp.simulation;
      if (simulation) {
        if(rpc.Api.isSimulationError(simulation)) {
          throw new Error(simulation.error);
        }
        if (rpc.Api.isSimulationRestore(simulation)) {
          await depositOp.restoreFootprint(simulation.restorePreamble);
          
          return await this.mintCUSD(amount);
        }
        if (rpc.Api.isSimulationSuccess(simulation)) {
          const response = await depositOp.signAndSend({ signTransaction: this.signTransaction });
          return response.sendTransactionResponse?.hash;
        }
      }
      
      return undefined;
    }
  
    async burnCUSD(amount: number): Promise<string | undefined> { 
      if (!this.walletAddress || !this.signTransaction) {
        throw new Error('Wallet connection required for burn operation');
      }
      const yieldController = getYieldControllerClient(this.network, this.walletAddress);
      const withdrawOp = await yieldController.withdraw_collateral({
        protocol: SupportedProtocols.BlendProtocol,
        user: this.walletAddress,
        asset: this.config.usdc.contractId,
        amount: toBigInt(amount),
      }, {
        simulate: true
      });
      
      const simulation = withdrawOp.simulation;
      if (simulation) {
        if(rpc.Api.isSimulationError(simulation)) {
          throw new Error(simulation.error);
        }
        if (rpc.Api.isSimulationRestore(simulation)) {
          await withdrawOp.restoreFootprint(simulation.restorePreamble);
          return await this.burnCUSD(amount);
        }
        if (rpc.Api.isSimulationSuccess(simulation)) {
          const response = await withdrawOp.signAndSend({ signTransaction: this.signTransaction });
          return response.sendTransactionResponse?.hash;
        }
      }
      
      return undefined;
    }

    async getYield(): Promise<string | undefined> {      
        const yieldController = getYieldControllerClient(this.network);
        const lendingYield = await yieldController.get_yield({
          protocol: SupportedProtocols.BlendProtocol,
          asset: this.config.usdc.contractId,
        });
        const result = lendingYield.result.valueOf().toString();
        return result;
    }

    async getTotalAPY(): Promise<number | undefined> {
      const yieldController = getYieldControllerClient(this.network);
      const apy = await yieldController.get_apy({
        protocol: SupportedProtocols.BlendProtocol,
        asset: this.config.usdc.contractId,
      });
      return (apy.result.valueOf() / 10000) * 100; 
    }
}