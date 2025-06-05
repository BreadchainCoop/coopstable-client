import {
    StellarWalletsKit,
    ISupportedWallet,
    WalletNetwork,
    FreighterModule,
} from '@creit.tech/stellar-wallets-kit';
import { rpc, xdr } from '@stellar/stellar-sdk';
import { Network, getNetworkConfig } from '@/app/config';
import { AssembledTransaction, SignTransaction } from '@stellar/stellar-sdk/contract';
import { getTokenClient, getYieldControllerClient } from '@/app/contracts'; 
import { TransactionService } from './transactionService';

export class CoopStableContractService {
    private txService: TransactionService;    
    constructor(
      private network: Network,
      private walletAddress: string,
      stellarRpc: rpc.Server
    ) {
      this.txService = new TransactionService(
        stellarRpc,
        { passphrase: getNetworkConfig(network).networkPassphrase, rpc: getNetworkConfig(network).sorobanUrl },
        walletAddress
      );
    }
  
    async mintCUSD(
      amount: bigint,
      signTransaction: SignTransaction
    ): Promise<bigint | undefined> {
        const config = getNetworkConfig(this.network);
        const yieldController = getYieldControllerClient(this.network, this.walletAddress);
        const depositOp = await yieldController.deposit_collateral({
            protocol: "BC_LA",
            user: this.walletAddress,
            asset: config.usdc.contractId,
            amount: amount,
        });
        const depositXdrOp = xdr.Operation.fromXDR(depositOp.toXDR(), 'base64');
        const simulation = await this.simulateOp(depositOp);
        if (simulation.success) return await this.txService.invokeSorobanOperation<bigint>(
            depositXdrOp,
            signTransaction
        );
    }
  
    async burnCUSD(amount: bigint, signTransaction: SignTransaction): Promise<bigint> {
      const config = getNetworkConfig(this.network);
      const yieldController = getYieldControllerClient(this.network, this.walletAddress);
      const withdrawOp = await yieldController.withdraw_collateral({
        protocol: "BC_LA",
        user: this.walletAddress,
        asset: config.usdc.contractId,
        amount: amount,
      });
      const withdrawXdrOp = xdr.Operation.fromXDR(withdrawOp.toXDR(), 'base64');
      const result = await this.txService.invokeSorobanOperation<bigint>(
        withdrawXdrOp,
        signTransaction
      );
      return result || amount;
    }

    // get yield
    // distribute yield
    // ditribute emissions
    
    private async simulateOp<T>(assembledTx: AssembledTransaction<T>): Promise<{
      fee: string;
      success: boolean;
      result: rpc.Api.SimulateHostFunctionResult | undefined;
    }> {
      const xdrOp = xdr.Operation.fromXDR(assembledTx.toXDR(), 'base64');
      const simulation = await this.txService.simulateOperation(xdrOp);
      if (rpc.Api.isSimulationError(simulation)) {
        throw new Error(simulation.error);
      }
      return {
        fee: simulation.minResourceFee,
        success: true,
        result: simulation.result
      };
    }
  }
  

  
