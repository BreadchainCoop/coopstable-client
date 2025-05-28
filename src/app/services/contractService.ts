import * as StellarSdk from "@stellar/stellar-sdk";

import { SignTransaction } from "@stellar/stellar-sdk/contract";
import { getYieldControllerClient } from "../contracts/contracts";
import { NetworkString } from "./UserService/types";
import { chainConfig } from "../config";
import { parseRawSimulation } from "@stellar/stellar-sdk/rpc";
import { nativeToScVal, TransactionBuilder } from "@stellar/stellar-sdk";

export type ContractService = {
  yieldController: {
    mint: (
      account: string,
      sequenceNumber: string,
      amount: bigint,
      network: NetworkString,
      signTransaction: SignTransaction,
    ) => Promise<bigint>;
    burn: (
      account: string,
      amount: bigint,
      network: NetworkString,
      signTransaction: SignTransaction,
    ) => Promise<bigint>;
  };
  usdc: {
    fetchAllowance: (
      owner: string,
      spender: string,
      network: NetworkString,
    ) => Promise<number | null>;
  };
};

export const contractService: ContractService = {
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
        rootInvocation: xdr.AuthorizedInvocation({
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
    burn: async (account, amount, network, signTransaction) => {
      const contract = getYieldControllerClient(network, account);
      const tx = await contract.deposit_collateral({
        protocol: "protocol",
        user: account,
        asset: usdcContractId,
        amount,
      });
      const res = await tx?.signAndSend({
        signTransaction: signTransaction,
      });
      return res.result;
    },
  },
  usdc: {
    fetchAllowance: async (owner, spender, network) => {
      try {
        const server = new StellarSdk.rpc.Server(
          "https://soroban-testnet.stellar.org",
        );
        const contract = new StellarSdk.Contract(usdcContractId);
        const sourceAccount = await server.getAccount(owner);
        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            contract.call(
              "allowance",
              StellarSdk.nativeToScVal(owner, { type: "address" }),
              StellarSdk.nativeToScVal(spender, { type: "address" }),
            ),
          )
          .setTimeout(30)
          .build();

        const simRes = await server.simulateTransaction(transaction);
        // const transactionResult = await server.sendTransaction(
        //   StellarSdk.TransactionBuilder.fromXDR(
        //     signedTransaction.signedTxXdr,
        //     StellarSdk.Networks.TESTNET
        //   )
        // );

        console.log("\n\n------------------------", simRes);
        simRes.events.forEach((event) => {
          console.log("EVENT: ", event);
        });
        console.log({ simRes });
        const parsed = parseRawSimulation(simRes);
        console.log({ parsed });
        /* eslint-disable */
        console.log("allowance value: ", (simRes as any).result.retval._value);
        // type Woo = Prettify<typeof simRes>;
        // simRes as Woo;
        // console.log(simRes.result !== undefined);

        // switch (transactionResult.status) {
        //   case "ERROR":
        //     console.log("Transaction failed: ", transactionResult.errorResult);
        //     return;
        //   default:
        //     console.log("Transaction successful");
        // }
      } catch (error) {
        console.error("Error sending transaction:", error);
      }

      return 7;
    },
  },
};
