import { Client as TokenClient } from "@stellar/stellar-sdk/contract";
import { chainConfig, Network } from "../config";
import * as YieldControllerClient from "@/packages/lending_yield_controller/src/index";
import * as YieldDistributorClient from "@/packages/yield_distributor/src/index"; 

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

export function getYieldDistributorClient(network: Network, publicKey: string) {
  return new YieldDistributorClient.Client({
    contractId: chainConfig[network].yieldDistributor.contractId,
    networkPassphrase: YieldDistributorClient.Networks[network],
    rpcUrl: chainConfig[network].sorobanUrl,
    allowHttp: true,
    publicKey,
  });
}

export function getTokenClient(
  network: Network,
  publicKey: string,
  asset: string,
) {
  return TokenClient.from({
    contractId: asset,
    networkPassphrase: YieldControllerClient.Networks[network],
    rpcUrl: chainConfig[network].sorobanUrl,
    allowHttp: true,
    publicKey,
  });
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
