
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
      const operationXdr = xdr.Operation.fromXDR(transaction.toXDR(), 'base64');
      const simulation = await this.simulateOperation(operationXdr);
      if (rpc.Api.isSimulationError(simulation)) {
        throw new Error(simulation.error);
      } 
      await this.invokeSorobanOperation(operationXdr, simulation.minResourceFee);  
    }

    private async invokeSorobanOperation(
      operation: xdr.Operation,
      simulationFee?: string
    ) {
      try {
        const account = await this.stellarRpc.getAccount(this.walletAddress);
        const txBuilder = new TransactionBuilder(account, {
          networkPassphrase: this.networkPassphrase,
          fee: simulationFee ? simulationFee : INCLUSION_FEE,
          timebounds: { 
            minTime: 0, 
            maxTime: Math.floor(Date.now() / 1000) + FIVE_MINUTES
          },
        }).addOperation(operation);
        const transaction = txBuilder.build();
        const simResponse = await this.stellarRpc.simulateTransaction(transaction);
        if (rpc.Api.isSimulationRestore(simResponse)) {
          await this.restore(simResponse); // request the user to pay for the restore
          await this.invokeSorobanOperation(operation);
        }
        const assembledTx = rpc.assembleTransaction(transaction, simResponse).build();
        const signedTxXdr = await this.sign(assembledTx.toXDR());
        const signedTx = new Transaction(signedTxXdr, this.networkPassphrase);
        const result = await this.sendTransaction(signedTx);
        if (result && rpc.Api.isSimulationError(simResponse)) {
          throw new Error(simResponse.error);
        }
      } catch (e) {
        console.error('Error invoking Soroban operation:', e);
        throw e;
      }
    }

    private async  simulateOperation( 
      operation: xdr.Operation
    ): Promise<rpc.Api.SimulateTransactionResponse> {
      const account = await this.stellarRpc.getAccount(this.walletAddress);
      const txBuilder = new TransactionBuilder(account, {
        networkPassphrase: this.networkPassphrase,
        fee: INCLUSION_FEE,
        timebounds: { 
          minTime: 0, 
          maxTime: Math.floor(Date.now() / 1000) + FIVE_MINUTES // 5 minutes
        },
      }).addOperation(operation);
      const transaction = txBuilder.build();
      return await this.stellarRpc.simulateTransaction(transaction);
    }

    private async restore(
      sim: rpc.Api.SimulateTransactionRestoreResponse
    ): Promise<void> {
      const account = await this.stellarRpc.getAccount(this.walletAddress);
      const fee = parseInt(sim.restorePreamble.minResourceFee) + parseInt(INCLUSION_FEE);
      const restoreTx = new TransactionBuilder(account, { fee: fee.toString() })
        .setNetworkPassphrase(this.networkPassphrase)
        .setTimeout(0)
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
          let { signedTxXdr } = await this.signTransaction(xdr, {
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
  