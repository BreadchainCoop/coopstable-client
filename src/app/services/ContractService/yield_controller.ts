import * as StellarSdk from "@stellar/stellar-sdk";
import { SignTransaction } from "@stellar/stellar-sdk/contract";
import { Network, getNetworkConfig, chainConfig } from "@/app/config";

import { nativeToScVal, TransactionBuilder, xdr } from "@stellar/stellar-sdk";
import { fetchAllowance } from "./token";
import { TOKEN_CODES } from "@/app/constants";
import { type ContractService } from "./types";

export async function deposit_collateral(
  account: string, 
  amount: bigint, 
  network: Network, 
  sequenceNumber: string,
  signTransaction: SignTransaction
) {
  const config = chainConfig[network];
  const yieldControllerContractId = config.yieldController.contractId;
  const usdcContractId = config.usdc.contractId;
        
  try {
    // Create source account for transaction builder
    const sourceAccount = new StellarSdk.Account(account, sequenceNumber);
    const server = new StellarSdk.rpc.Server(config.sorobanUrl);
    
    // Create contract instances
    const yieldControllerContract = new StellarSdk.Contract(yieldControllerContractId);
    const usdcContract = new StellarSdk.Contract(usdcContractId);
    
    // Build the transaction with two operations:
    // 1. Approve the yieldController to spend USDC tokens
    // 2. Call deposit_collateral on the yieldController
    
    // First operation: approve
    const approveArgs = [
      nativeToScVal(account, { type: "address" }), // from
      nativeToScVal(yieldControllerContractId, { type: "address" }), // spender
      nativeToScVal(amount, { type: "i128" }), // amount
      nativeToScVal(535680 + 100, { type: "u32" }) // expiration_ledger (current + ~1 day)
    ];
    
    // Second operation: deposit_collateral
    // The protocol parameter appears to be a string identifier (e.g., "BC_LA" for Blend Capital)
    const depositArgs = [
      nativeToScVal("BC_LA", { type: "string" }), // protocol identifier
      nativeToScVal(account, { type: "address" }), // user
      nativeToScVal(usdcContractId, { type: "address" }), // asset
      nativeToScVal(amount, { type: "i128" }) // amount
    ];
    
    // Build the transaction with both operations
    let tx = new TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE, // Initial fee, will be updated after simulation
      networkPassphrase: config.networkPassphrase,
    })
      .addOperation(usdcContract.call("approve", ...approveArgs))
      .addOperation(yieldControllerContract.call("deposit_collateral", ...depositArgs))
      .setTimeout(180) // 3 minutes timeout
      .build();
    
    // Simulate transaction to get proper fees and auth requirements
    const simulationResponse = await server.simulateTransaction(tx);
    
    if (StellarSdk.rpc.Api.isSimulationError(simulationResponse)) {
      console.error("Simulation error:", simulationResponse.error);
      throw new Error(`Transaction simulation failed: ${simulationResponse.error}`);
    }
    
    if (!StellarSdk.rpc.Api.isSimulationSuccess(simulationResponse)) {
      throw new Error("Transaction simulation did not succeed");
    }
    
    // Prepare the transaction from simulation results
    const preparedTx = StellarSdk.rpc.assembleTransaction(
      tx,
      simulationResponse
    ).build();
    
    // Sign the transaction
    const { signedTxXdr } = await signTransaction(preparedTx.toXDR(), {
      networkPassphrase: config.networkPassphrase,
    });
    
    // Submit the transaction
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedTxXdr,
      config.networkPassphrase
    );
    
    const submitResponse = await server.sendTransaction(signedTx);
    
    // Handle different response statuses
    if (submitResponse.status === "ERROR") {
      throw new Error(`Transaction submission failed: ${submitResponse.errorResult}`);
    }
    
    if (submitResponse.status === "PENDING") {
      // Wait for transaction confirmation
      let getTransactionResponse = await server.getTransaction(submitResponse.hash);
      const maxRetries = 30; // 30 seconds timeout
      let retries = 0;
      
      while (getTransactionResponse.status === "NOT_FOUND" && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        getTransactionResponse = await server.getTransaction(submitResponse.hash);
        retries++;
      }
      
      if (getTransactionResponse.status === "SUCCESS") {
        console.log("Mint transaction successful:", submitResponse.hash);
        // Return the deposited amount
        return amount;
      } else if (getTransactionResponse.status === "FAILED") {
        throw new Error(`Transaction failed: ${submitResponse.hash}`);
      } else {
        throw new Error(`Transaction timeout: ${submitResponse.hash}`);
      }
    }
    
    // If we get here, something unexpected happened
    throw new Error("Unexpected transaction status");
    
  } catch (error) {
    console.error("Error in mint operation:", error);
    throw error;
  }
}

export async function withdraw_collateral(
  account: string, 
  amount: bigint, 
  network: Network, 
  signTransaction: SignTransaction
) {
  const config = chainConfig[network];
  const yieldControllerContractId = config.yieldController.contractId;
  const cusdContractId = config.cusd.contractId;      
  try {
    // Get account details for sequence number
    const server = new StellarSdk.rpc.Server(config.sorobanUrl);
    const horizonServer = new StellarSdk.Horizon.Server(config.horizonUrl);
    const accountResponse = await horizonServer.loadAccount(account);
    
    // Create source account for transaction builder
    const sourceAccount = new StellarSdk.Account(account, accountResponse.sequence);
    
    // Create contract instances
    const yieldControllerContract = new StellarSdk.Contract(yieldControllerContractId);
    const cusdContract = new StellarSdk.Contract(cusdContractId);
    
    // Build the transaction with two operations:
    // 1. Approve the yieldController to spend cUSD tokens
    // 2. Call withdraw_collateral on the yieldController
    
    // First operation: approve cUSD spending
    const approveArgs = [
      nativeToScVal(account, { type: "address" }), // from
      nativeToScVal(yieldControllerContractId, { type: "address" }), // spender
      nativeToScVal(amount, { type: "i128" }), // amount
      nativeToScVal(535680 + 100, { type: "u32" }) // expiration_ledger
    ];
    
    // Second operation: withdraw_collateral
    const withdrawArgs = [
      nativeToScVal("BC_LA", { type: "string" }), // protocol identifier
      nativeToScVal(account, { type: "address" }), // user
      nativeToScVal(cusdContractId, { type: "address" }), // asset (cUSD)
      nativeToScVal(amount, { type: "i128" }) // amount
    ];
    
    // Build the transaction
    let tx = new TransactionBuilder(sourceAccount, {
      fee: "10000", // Initial fee
      networkPassphrase: config.networkPassphrase,
    })
      .addOperation(cusdContract.call("approve", ...approveArgs))
      .addOperation(yieldControllerContract.call("withdraw_collateral", ...withdrawArgs))
      .setTimeout(180)
      .build();
    
    // Simulate transaction
    const simulationResponse = await server.simulateTransaction(tx);
    
    if (StellarSdk.rpc.Api.isSimulationError(simulationResponse)) {
      console.error("Simulation error:", simulationResponse.error);
      throw new Error(`Transaction simulation failed: ${simulationResponse.error}`);
    }
    
    if (!StellarSdk.rpc.Api.isSimulationSuccess(simulationResponse)) {
      throw new Error("Transaction simulation did not succeed");
    }
    
    // Prepare the transaction from simulation results
    const preparedTx = StellarSdk.rpc.assembleTransaction(
      tx,
      simulationResponse
    ).build();
    
    // Sign the transaction
    const { signedTxXdr } = await signTransaction(preparedTx.toXDR(), {
      networkPassphrase: config.networkPassphrase,
    });
    
    // Submit the transaction
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedTxXdr,
      config.networkPassphrase
    );
    
    const submitResponse = await server.sendTransaction(signedTx);
    
    // Handle response
    if (submitResponse.status === "ERROR") {
      throw new Error(`Transaction submission failed: ${submitResponse.errorResult}`);
    }
    
    if (submitResponse.status === "PENDING") {
      // Wait for transaction confirmation
      let getTransactionResponse = await server.getTransaction(submitResponse.hash);
      const maxRetries = 30;
      let retries = 0;
      
      while (getTransactionResponse.status === "NOT_FOUND" && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        getTransactionResponse = await server.getTransaction(submitResponse.hash);
        retries++;
      }
      
      if (getTransactionResponse.status === "SUCCESS") {
        console.log("Burn transaction successful:", submitResponse.hash);
        return amount;
      } else if (getTransactionResponse.status === "FAILED") {
        throw new Error(`Transaction failed: ${submitResponse.hash}`);
      } else {
        throw new Error(`Transaction timeout: ${submitResponse.hash}`);
      }
    }
    
    throw new Error("Unexpected transaction status");
    
  } catch (error) {
    console.error("Error in burn operation:", error);
    throw error;
  }
}