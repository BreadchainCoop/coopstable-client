import * as StellarSdk from "@stellar/stellar-sdk";
import { Network, getNetworkConfig } from "@/app/config";

export async function fetchAllowance(owner: string, spender: string, asset: string, network: Network) {
  const config = getNetworkConfig(network);
  try {
        const server = new StellarSdk.rpc.Server(config.sorobanUrl);
        const contract = new StellarSdk.Contract(asset);
        const sourceAccount = await server.getAccount(owner);
        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: getNetworkConfig(network).networkPassphrase,
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
}
