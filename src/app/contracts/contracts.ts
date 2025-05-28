import { Client as TokenClient } from "@stellar/stellar-sdk/contract";

import { chainConfig } from "../config";
import { NetworkString } from "../services/UserService/types";
import * as YieldControllerClient from "./YieldController";

export function getUSDCClient(network: NetworkString, publicKey: string) {
  const tokenClient = TokenClient.from({
    contractId: chainConfig[network].usdc.contractId,
    networkPassphrase: YieldControllerClient.Networks[network],
    rpcUrl: chainConfig[network].sorobanUrl,
    allowHttp: true,
    publicKey,
  });
  return tokenClient;
}

export function getYieldControllerClient(
  network: NetworkString,
  publicKey?: string,
): YieldControllerClient.Client {
  return new YieldControllerClient.Client({
    networkPassphrase: YieldControllerClient.Networks[network],
    contractId: chainConfig[network].yieldController.contractId,
    rpcUrl: chainConfig[network].sorobanUrl,
    allowHttp: true,
    publicKey,
  });
}
