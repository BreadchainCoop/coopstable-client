import { Operation, rpc, xdr, ScInt, nativeToScVal,  } from '@stellar/stellar-sdk';
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
    constructor(
      network: Network,
      walletAddress: string,
      stellarRpc: rpc.Server,
      private signTransaction: SignTransaction
    ) {
      this.walletAddress = walletAddress;
      this.config = getNetworkConfig(network);
      
      this.txService = new TransactionService(
        this.walletAddress,
        this.config.networkPassphrase,
        stellarRpc,
        signTransaction
      );
      this.mintCUSD = this.mintCUSD.bind(this);
      this.burnCUSD = this.burnCUSD.bind(this);
    }
    
    async mintCUSD(amount: number): Promise<void> {
      const yieldController = getYieldControllerClient(this.config.network, this.walletAddress);
      const operation = await yieldController.deposit_collateral({
        protocol: "BC_LA",
        user: this.walletAddress,
        asset: this.config.usdc.contractId,
        amount: toBigInt(amount),
      }, {
        simulate: true
      });
      if (operation.result) {
        let res = await operation.signAndSend({ signTransaction: this.signTransaction });
        console.log('Operation:', res);
      }
    }
  
    async burnCUSD(amount: number): Promise<void> { 
      const yieldController = getYieldControllerClient(this.config.network, this.walletAddress);
      const withdrawOp = await yieldController.withdraw_collateral({
        protocol: "BC_LA",
        user: this.walletAddress,
        asset: this.config.usdc.contractId,
        amount: toBigInt(amount),
      }, {
        simulate: true
      });
      if (withdrawOp.result) {
        let res = await withdrawOp.signAndSend({ signTransaction: this.signTransaction });
        console.log('Operation:', res);
      }
    }


  }
  

  



