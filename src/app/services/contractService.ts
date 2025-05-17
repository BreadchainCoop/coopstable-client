import * as StellarSdk from "@stellar/stellar-sdk";

import { SignTransaction } from "@stellar/stellar-sdk/contract";
import {
  getTokenAClient,
  getYieldControllerClient,
} from "../contracts/contracts";
import { NetworkString } from "./UserService/types";
import { chainConfig } from "../config";
import { parseRawSimulation } from "@stellar/stellar-sdk/rpc";
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config";

export type ContractService = {
  yieldController: {
    mint: (
      account: string,
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
  cusd: {
    fetchBalance: (
      account: string,
      network: NetworkString,
    ) => Promise<number | null>;
  };
  usdc: {
    fetchBalance: (
      account: string,
      network: NetworkString,
    ) => Promise<number | null>;
    fetchAllowance: (
      owner: string,
      spender: string,
      network: NetworkString,
    ) => Promise<number | null>;
  };
};

export const contractService: ContractService = {
  yieldController: {
    mint: async (account, amount, network, signTransaction) => {
      const contract = getYieldControllerClient(network, account);
      const tx = await contract.deposit_collateral({
        protocol: "protocol",
        user: account,
        asset: chainConfig[network].usdc.contractId,
        amount,
      });
      const res = await tx?.signAndSend({
        signTransaction: signTransaction,
      });
      return res.result;
    },
    burn: async (account, amount, network, signTransaction) => {
      const contract = getYieldControllerClient(network, account);
      const tx = await contract.deposit_collateral({
        protocol: "protocol",
        user: account,
        asset: chainConfig[network].usdc.contractId,
        amount,
      });
      const res = await tx?.signAndSend({
        signTransaction: signTransaction,
      });
      return res.result;
    },
  },
  cusd: {
    fetchBalance: async (account, network): Promise<number> => {
      const contract = getTokenAClient(network, account);
      const res = await contract.balance({ account });
      return Number(res.result) / 10e18;
    },
  },
  usdc: {
    fetchBalance: async () =>
      // account,
      //  network
      {
        return 7;
      },
    // fetchAllowance: async (
    //   owner: string,
    //   spender: string,
    //   network: NetworkString,
    // ): Promise<number> => {
    //   const contract = getTokenAClient(network, owner);
    //   const res = await contract.allowance({ owner, spender });
    //   return Number(res.result) / 10e18;
    // },
    fetchAllowance: async (owner, spender, network) => {
      try {
        const server = new StellarSdk.rpc.Server(
          "https://soroban-testnet.stellar.org",
        );
        const contract = new StellarSdk.Contract(
          chainConfig[network].usdc.contractId,
        );
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
        console.log("current count: ", (simRes as any).result.retval._value);
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
