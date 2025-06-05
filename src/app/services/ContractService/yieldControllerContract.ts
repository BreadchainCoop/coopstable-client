import { Operation, rpc, xdr, ScInt, nativeToScVal } from '@stellar/stellar-sdk';
import { Network, NetworkConfig, getNetworkConfig } from '@/app/config';
import { getYieldControllerClient } from '@/app/contracts'; 
import { TransactionService } from '../transactionService';
import { IYieldControllerContract } from './types';
import { SignTransaction, i128 } from '@stellar/stellar-sdk/contract';
import { parseLumen, toBigInt } from '@/app/utils/tokenFormatting';

export class YieldControllerContract implements IYieldControllerContract {
    private txService: TransactionService;    
    private config: NetworkConfig;
    private walletAddress: string;
    private network: Network;
    
    constructor(
      network: Network,
      walletAddress: string,
      stellarRpc: rpc.Server,
      signTransaction: SignTransaction
    ) {
      console.log('YieldControllerContract constructor called with:', { network, walletAddress, stellarRpc: !!stellarRpc, signTransaction: !!signTransaction });
      
      this.network = network;
      this.walletAddress = walletAddress;
      this.config = getNetworkConfig(network);
      
      console.log('Config set:', this.config);
      
      this.txService = new TransactionService(
        this.walletAddress,
        this.config.networkPassphrase,
        stellarRpc,
        signTransaction
      );
      
      console.log('YieldControllerContract initialized successfully');
      
      // Bind methods to preserve context
      this.mintCUSD = this.mintCUSD.bind(this);
      this.burnCUSD = this.burnCUSD.bind(this);
    }
    
    async mintCUSD(amount: number): Promise<void> {
      console.log('mintCUSD called with amount:', amount);
      console.log('this.config at start of mintCUSD:', this.config);
      console.log('this.walletAddress:', this.walletAddress);
      console.log('this object keys:', Object.keys(this));
      
      if (!this.config) {
        console.error('this.config is undefined in mintCUSD');
        throw new Error('Contract configuration is not initialized');
      }
      
      try {
        console.log("MINTING mintCUSD");
        const yieldController = getYieldControllerClient(this.network, this.walletAddress);
        
        const operation = await yieldController.deposit_collateral({
          protocol: "BC_LA",
          user: this.walletAddress,
          asset: this.config.usdc.contractId,
          amount: toBigInt(amount),
        });
        
        await this.txService.mutateXdr(operation);
      } catch (error) {
        console.error('Error in mintCUSD:', error);
        throw error;
      }
    }
  
    async burnCUSD(amount: number): Promise<void> {
      if (!this.config) {
        throw new Error('Contract configuration is not initialized');
      }
      
      try {
        const yieldController = getYieldControllerClient(this.network, this.walletAddress);
        const withdrawOp = await yieldController.withdraw_collateral({
          protocol: "BC_LA",
          user: this.walletAddress,
          asset: this.config.usdc.contractId,
          amount: toBigInt(amount),
        });
        await this.txService.mutateXdr(withdrawOp);
      } catch (error) {
        console.error('Error in burnCUSD:', error);
        throw error;
      }
    }
}