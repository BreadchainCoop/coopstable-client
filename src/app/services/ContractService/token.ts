import * as StellarSdk from "@stellar/stellar-sdk";
import { Network, getNetworkConfig } from "@/app/config";

export async function fetchAllowance(
  owner: string, 
  spender: string, 
  tokenContractId: string, 
  network: Network
): Promise<number> {
  const config = getNetworkConfig(network);
  
  try {
    const server = new StellarSdk.rpc.Server(config.sorobanUrl);
    const contract = new StellarSdk.Contract(tokenContractId);
    const sourceAccount = await server.getAccount(owner);
    
    // Build the allowance call
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: config.networkPassphrase,
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
    
    if (StellarSdk.rpc.Api.isSimulationError(simRes)) {
      console.error("Simulation error:", simRes.error);
      return 0;
    }

    if (simRes.result && simRes.result.retval) {
      const resultValue = simRes.result.retval;
      const parts = resultValue.value();
      return Number(parts?.toLocaleString("en-US"));
    }
    return 0;
  } catch (error) {
    console.error("Error fetching allowance:", error);
    return 0;
  }
}

// export async function approve(
//   owner: string, 
//   spender: string, 
//   amount: bigint, 
//   asset: string, 
//   expiration: number, 
//   network: Network
// ) {
//   const config = getNetworkConfig(network);
//   try {
//     const server = new StellarSdk.rpc.Server(config.sorobanUrl);    
//     const contract = new StellarSdk.Contract(asset);
//     const sourceAccount = await server.getAccount(owner);
    
//     // Build the allowance call
//     const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
//       fee: StellarSdk.BASE_FEE,
//       networkPassphrase: config.networkPassphrase,
//     })
//       .addOperation(
//         contract.call(
//           "approve",
//           StellarSdk.nativeToScVal(owner, { type: "address" }),
//           StellarSdk.nativeToScVal(spender, { type: "address" }),
//           StellarSdk.nativeToScVal(amount, { type: "i128" }),
//           StellarSdk.nativeToScVal(expiration, { type: "u32" }),
//         ),
//       )
//       .setTimeout(30)
//       .build();

//     const simRes = await server.simulateTransaction(transaction);
    
//     if (StellarSdk.rpc.Api.isSimulationError(simRes)) {
//       console.error("Simulation error:", simRes.error);
//       return false;
//     }

//     if (simRes.result && simRes.result.retval) {
//       const resultValue = simRes.result.retval;
//       const parts = resultValue.value();
//       console.log(parts);
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.error("Error fetching allowance:", error);
//     return false;
//   }
// }