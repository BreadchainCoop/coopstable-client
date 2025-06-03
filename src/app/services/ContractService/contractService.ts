import * as StellarSdk from "@stellar/stellar-sdk";
import { SignTransaction } from "@stellar/stellar-sdk/contract";
import { Network } from "@/app/config";
import { chainConfig } from "../../config";
import { parseRawSimulation } from "@stellar/stellar-sdk/rpc";
import { nativeToScVal, TransactionBuilder } from "@stellar/stellar-sdk";
import { fetchAllowance, approve } from "./token";
import { TOKEN_CODES } from "@/app/constants";
import { type ContractService } from "./types";


export const contractService: ContractService = {
  contracts: {
    yieldController: {
      mint: async (account, sequenceNumber, amount, network, signTransaction) => {
        const yieldControllerContractId =
          chainConfig[network].yieldController.contractId;
        const usdcContractId = chainConfig[network].usdc.contractId;
  
        const sourceAccount = new StellarSdk.Account(account, sequenceNumber);
  
        const yieldControllerContract = new StellarSdk.Contract(
          yieldControllerContractId,
        );
        const usdcContract = new StellarSdk.Contract(usdcContractId);
  
        const authEntry = new StellarSdk.xdr.SorobanAuthorizationEntry({
          credentials:
            StellarSdk.xdr.SorobanCredentials.sorobanCredentialsAddress(
              new StellarSdk.xdr.SorobanAddressCredentials({
                address: userAddress.toScAddress(),
              }),
            ),
          rootInvocation: StellarSdk.xdr.AuthorizedInvocation({
            contractId: tokenContractAddress.toScAddress(),
            functionName: "approve",
            args: [
              userAddress.toScVal(), // from
              mainContractAddress.toScVal(), // spender
              nativeToScVal(1000000, { type: "i128" }), // amount
            ].map(xdr.ScVal.fromXDR),
            subInvocations: [],
          }),
        });
  
        // Build approve operation (token contract)
        const approveArgs = [
          nativeToScVal(account, { type: "address" }), // owner
          nativeToScVal(yieldControllerContractId, {
            type: "address",
          }),
          nativeToScVal(amount, { type: "i128" }),
        ];
  
        // Build main contract operation
        const executeArgs = [
          nativeToScVal("BC_LA", { type: "string" }),
          nativeToScVal(account, { type: "address" }),
          nativeToScVal(usdcContractId, {
            type: "address",
          }),
          nativeToScVal(amount, { type: "i128" }),
        ];
  
        const operations = [
          {
            contract: usdcContractId,
            method: "approve",
            args: approveArgs,
          },
          {
            contract: chainConfig[network].yieldController.contractId,
            method: "deposit_collateral",
            args: executeArgs,
          },
        ];
  
        const mainOperation = StellarSdk.Operation.invokeHostFunction({
          func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
            new StellarSdk.xdr.InvokeContractArgs({
              contractAddress: StellarSdk.Address.fromString(
                yieldControllerContractId,
              ).toScAddress(),
              functionName: "deposit_collateral",
              args: [...executeArgs],
            }),
          ),
          auth: [
            // Add authorization entry for the token approval
            StellarSdk.xdr.SorobanAuthorizationEntry.fromJSON({
              credentials: {
                type: "address",
                address: {
                  accountId: userPublicKey,
                },
              },
              rootInvocation: {
                function: {
                  type: "contract",
                  contractId: tokenContractId,
                  functionName: "approve",
                  args: [
                    Address.fromString(userPublicKey).toScVal(),
                    Address.fromString(mainContractId).toScVal(),
                    nativeToScVal(1000000, { type: "i128" }),
                  ],
                },
                subInvocations: [],
              },
            }),
          ],
        });
  
        // Create transaction with both operations
        let tx = new TransactionBuilder(sourceAccount, {
          fee: "1000", // Initial fee (will be adjusted)
          networkPassphrase: chainConfig[network].networkPassphrase,
        })
          .addOperation(
            StellarSdk.Operation.invokeHostFunction({
              func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
                new StellarSdk.xdr.InvokeContractArgs({
                  contractAddress: Buffer.from(contractId, "hex"),
                  functionName: "batch",
                  args: operations.map((op) =>
                    StellarSdk.xdr.ScVal.scvObject(
                      StellarSdk.xdr.ScObject.scoVec([
                        StellarSdk.xdr.ScVal.scvSymbol(op.contract),
                        StellarSdk.xdr.ScVal.scvSymbol(op.method),
                        ...op.args,
                      ]),
                    ),
                  ),
                }),
              ),
              auth: [],
            }),
          )
          .setTimeout(30)
          .build();
  
        const server = new StellarSdk.rpc.Server(chainConfig[network].sorobanUrl);
  
        // Simulate transaction to get proper fee
        const simulated = await server.simulateTransaction(tx);
        if (StellarSdk.rpc.Api.isSimulationError(simulated)) {
          throw simulated.error;
        }
  
        tx = new TransactionBuilder(sourceAccount, {
          fee: simulated.minResourceFee,
          networkPassphrase: chainConfig[network].networkPassphrase,
        })
          .addOperation(usdcContract.call("approve", ...approveArgs))
          .addOperation(
            yieldControllerContract.call("deposit_collateral", ...executeArgs),
          )
          .setTimeout(30)
          .build();
  
        const { signedTxXdr } = await signTransaction(tx.toXDR());
  
        const res = server.sendTransaction(
          StellarSdk.TransactionBuilder.fromXDR(
            signedTxXdr,
            chainConfig[network].networkPassphrase,
          ),
        );
  
        console.log("mint response: ", res);
  
        return BigInt(42);
      },
      burn: async (account, amount, network, signTransaction) => Promise.resolve(0),
    },
  },
  sacs: {
    usdc: {
      fetchAllowance: (owner, spender, network) => fetchAllowance(owner, spender, TOKEN_CODES.USDC.toLowerCase(), network),
    },
    cusd: {
      fetchAllowance: (owner, spender, network) => fetchAllowance(owner, spender, TOKEN_CODES.CUSD.toLowerCase(), network),
    },
  }  
};
