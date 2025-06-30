import { chainConfig, Network } from "../config";
import * as YieldControllerClient from "@/packages/lending_yield_controller/src/index";
import * as CUSDManagerCLient from "@/packages/cusd_manager/src/index";
import * as YieldDistributorClient from "@/packages/yield_distributor/src/index";

export function getYieldDistributorClient(network: Network, publicKey?: string) {
  return new YieldDistributorClient.Client({
    contractId: chainConfig[network].yieldDistributor.contractId,
    networkPassphrase: YieldDistributorClient.Networks[network],
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

export function getCUSDManagerClient(network: Network, publicKey?: string) {
  return new CUSDManagerCLient.Client({
    contractId: chainConfig[network].cusdManager.contractId,
    networkPassphrase: CUSDManagerCLient.Networks[network],
    rpcUrl: chainConfig[network].sorobanUrl,
    allowHttp: true,
    publicKey,
  });
}