import { Client as TokenClient } from "@stellar/stellar-sdk/contract";
import { chainConfig, Network } from "../config";
import * as YieldControllerClient from "./yieldController";

export function getUSDCClient(network: Network, publicKey: string) {
  const tokenClient = TokenClient.from({
    contractId: chainConfig[network].usdc.contractId,
    networkPassphrase: YieldControllerClient.Networks[network],
    rpcUrl: chainConfig[network].sorobanUrl,
    allowHttp: true,
    publicKey,
  });
  return tokenClient;
}

export async function getTokenClient(
  network: Network,
  publicKey: string,
  asset: string,
) {
  const tokenClient = await TokenClient.from({
    contractId: asset,
    networkPassphrase: YieldControllerClient.Networks[network],
    rpcUrl: chainConfig[network].sorobanUrl,
    allowHttp: true,
    publicKey,
  });
  tokenClient.spec;
  return tokenClient;
}

export function getYieldControllerClient(
  network: Network,
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
