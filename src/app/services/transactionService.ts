import {
  rpc,
  Transaction,
  TransactionBuilder,
  xdr,
  Operation,
} from '@stellar/stellar-sdk';
import { AssembledTransaction, SignTransaction } from "@stellar/stellar-sdk/contract";

const FIVE_MINUTES = 5 * 60;
const INCLUSION_FEE = "2000";

export class TransactionService {
  constructor(
    private walletAddress: string,
    private networkPassphrase: string,
    private stellarRpc: rpc.Server,
    private signTransaction: SignTransaction 
  ) {}

  async mutateXdr<T>(transaction: AssembledTransaction<T>) {
    console.log('SIMULATING RESULTS:', transaction.toXDR());
    
    try {
      // First simulate the assembled transaction directly
      const simulation = await this.stellarRpc.simulateTransaction(transaction.built!);
      
      if (rpc.Api.isSimulationError(simulation)) {
        throw new Error(`Simulation failed: ${simulation.error}`);
      }
      
      // If simulation is successful, proceed with signing and submission
      await this.signAndSubmitTransaction(transaction, simulation);
      
    } catch (error) {
      console.error('Error in mutateXdr:', error);
      throw error;
    }
  }

  private async signAndSubmitTransaction<T>(
    assembledTx: AssembledTransaction<T>,
    simulation: rpc.Api.SimulateTransactionResponse
  ) {
    try {
      // Handle restore if needed
      if (rpc.Api.isSimulationRestore(simulation)) {
        await this.restore(simulation);
        // Re-simulate after restore
        const newSimulation = await this.stellarRpc.simulateTransaction(assembledTx.built!);
        if (rpc.Api.isSimulationError(newSimulation)) {
          throw new Error(`Re-simulation failed after restore: ${newSimulation.error}`);
        }
        simulation = newSimulation;
      }

      // Assemble the transaction with simulation results
      const preparedTx = rpc.assembleTransaction(assembledTx.built!, simulation);
      
      // Sign the transaction
      const signedTxXdr = await this.sign(preparedTx.build().toXDR());
      const signedTx = new Transaction(signedTxXdr, this.networkPassphrase);
      
      // Submit the transaction
      await this.sendTransaction(signedTx);
      
    } catch (error) {
      console.error('Error in signAndSubmitTransaction:', error);
      throw error;
    }
  }

  private async restore(
    sim: rpc.Api.SimulateTransactionRestoreResponse
  ): Promise<void> {
    const account = await this.stellarRpc.getAccount(this.walletAddress);
    const fee = parseInt(sim.restorePreamble.minResourceFee) + parseInt(INCLUSION_FEE);
    
    const restoreTx = new TransactionBuilder(account, { 
      fee: fee.toString(),
      networkPassphrase: this.networkPassphrase,
      timebounds: { 
        minTime: 0, 
        maxTime: Math.floor(Date.now() / 1000) + FIVE_MINUTES
      }
    })
      .setSorobanData(sim.restorePreamble.transactionData.build())
      .addOperation(Operation.restoreFootprint({}))
      .build();
      
    const signedTxXdr = await this.sign(restoreTx.toXDR());
    const signedRestoreTx = new Transaction(signedTxXdr, this.networkPassphrase);
    await this.sendTransaction(signedRestoreTx);
  }

  private async sendTransaction(transaction: Transaction): Promise<boolean> {
    let sendTxResponse = await this.stellarRpc.sendTransaction(transaction);
    let currTime = Date.now();

    // Wait for transaction to be pending
    while (sendTxResponse.status !== 'PENDING' && Date.now() - currTime < 5000) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      sendTxResponse = await this.stellarRpc.sendTransaction(transaction);
    }

    if (sendTxResponse.status !== 'PENDING') {
      throw new Error(`Failed to submit transaction: ${sendTxResponse.errorResult || 'Unknown error'}`);
    }

    // Wait for transaction confirmation
    currTime = Date.now();
    let getTxResponse = await this.stellarRpc.getTransaction(sendTxResponse.hash);
    
    while (getTxResponse.status === 'NOT_FOUND' && Date.now() - currTime < 30000) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      getTxResponse = await this.stellarRpc.getTransaction(sendTxResponse.hash);
    }

    if (getTxResponse.status === 'NOT_FOUND') {
      console.log('Failed to send transaction', sendTxResponse.hash, sendTxResponse.errorResult); 
      throw new Error('Transaction confirmation timeout');
    }
    
    if (getTxResponse.status === 'SUCCESS') {
      console.log('Transaction successful:', transaction.hash().toString('hex'));
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    } else {
      throw new Error(`Transaction failed: ${getTxResponse.status}`);
    }
  }

  private async sign(xdr: string): Promise<string> {
    try {
      const { signedTxXdr } = await this.signTransaction(xdr, {
        address: this.walletAddress,
        networkPassphrase: this.networkPassphrase,
      });
      return signedTxXdr;
    } catch (e: any) {
      if (e === 'User declined access') {
        throw new Error('Transaction rejected by wallet.');
      } else if (typeof e === 'string') {
        throw new Error(e);
      }
      throw e;
    }
  } 
}