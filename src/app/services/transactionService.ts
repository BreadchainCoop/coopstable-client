
  import {
    rpc,
    Transaction,
    TransactionBuilder,
    xdr,
    Operation,
  } from '@stellar/stellar-sdk';
  import { SignTransaction } from "@stellar/stellar-sdk/contract";
  
  const INCLUSION_FEE = 2000;
  const FIVE_MINUTES = 5 * 60;

  export class TransactionService {
    constructor(
      private stellarRpc: rpc.Server,
      private network: { passphrase: string; rpc: string },
      private walletAddress: string,
      private txInclusionFee: string = INCLUSION_FEE.toString() 
    ) {}
  
    async simulateOperation(
      operation: xdr.Operation
    ): Promise<rpc.Api.SimulateTransactionResponse> {
      const account = await this.stellarRpc.getAccount(this.walletAddress);
      const txBuilder = new TransactionBuilder(account, {
        networkPassphrase: this.network.passphrase,
        fee: this.txInclusionFee,
        timebounds: { 
          minTime: 0, 
          maxTime: Math.floor(Date.now() / 1000) + FIVE_MINUTES // 5 minutes
        },
      }).addOperation(operation);
      
      const transaction = txBuilder.build();
      return await this.stellarRpc.simulateTransaction(transaction);
    }
  
    async invokeSorobanOperation<T>(
      operation: xdr.Operation,
      signTransaction: SignTransaction,
      simulationFee?: string
    ): Promise<T | undefined> {
      try {
        const account = await this.stellarRpc.getAccount(this.walletAddress);
        const txBuilder = new TransactionBuilder(account, {
          networkPassphrase: this.network.passphrase,
          fee: simulationFee ? simulationFee : this.txInclusionFee,
          timebounds: { 
            minTime: 0, 
            maxTime: Math.floor(Date.now() / 1000) + FIVE_MINUTES
          },
        }).addOperation(operation);
        
        const transaction = txBuilder.build();
        const simResponse = await this.stellarRpc.simulateTransaction(transaction);
        if (rpc.Api.isSimulationRestore(simResponse)) {
          await this.restore(simResponse, signTransaction);
          return this.invokeSorobanOperation<T>(operation, signTransaction);
        }
        const assembledTx = rpc.assembleTransaction(transaction, simResponse).build();
        const signedXdr = await signTransaction(assembledTx.toXDR(), {
          networkPassphrase: this.network.passphrase,
        });
        const signedTx = new Transaction(signedXdr.signedTxXdr, this.network.passphrase);
        const result = await this.sendTransaction(signedTx);
        
        if (result && rpc.Api.isSimulationSuccess(simResponse)) {
          return simResponse.result?.retval as T;
        }
        return undefined;
      } catch (e) {
        console.error('Error invoking Soroban operation:', e);
        throw e;
      }
    }

    private async restore(
      sim: rpc.Api.SimulateTransactionRestoreResponse,
      signTransaction: SignTransaction
    ): Promise<void> {
      const account = await this.stellarRpc.getAccount(this.walletAddress);
      const fee = parseInt(sim.restorePreamble.minResourceFee) + parseInt(this.txInclusionFee);
      const restoreTx = new TransactionBuilder(account, { fee: fee.toString() })
        .setNetworkPassphrase(this.network.passphrase)
        .setTimeout(0)
        .setSorobanData(sim.restorePreamble.transactionData.build())
        .addOperation(Operation.restoreFootprint({}))
        .build();
      const signedXdr = await signTransaction(restoreTx.toXDR(), {
        networkPassphrase: this.network.passphrase,
      });
      const signedRestoreTx = new Transaction(signedXdr.signedTxXdr, this.network.passphrase);
      await this.sendTransaction(signedRestoreTx);
    }

    private async sendTransaction(transaction: Transaction): Promise<boolean> {
      let sendTxResponse = await this.stellarRpc.sendTransaction(transaction);
      let currTime = Date.now();
  
      while (sendTxResponse.status !== 'PENDING' && Date.now() - currTime < 5000) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        sendTxResponse = await this.stellarRpc.sendTransaction(transaction);
      }
  
      if (sendTxResponse.status !== 'PENDING') {
        throw new Error(`Failed to submit transaction: ${sendTxResponse.errorResult}`);
      }
      currTime = Date.now();
      let getTxResponse = await this.stellarRpc.getTransaction(sendTxResponse.hash);
      while (getTxResponse.status === 'NOT_FOUND' && Date.now() - currTime < 30000) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        getTxResponse = await this.stellarRpc.getTransaction(sendTxResponse.hash);
      }
  
      if (getTxResponse.status === 'NOT_FOUND') {
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
  }
  