import { Client as TokenClient } from "@stellar/stellar-sdk/contract";

import { chainConfig } from "../config";
import { NetworkString } from "../services/UserService/types";
import * as TokenAClient from "./tokenA";
import * as TokenBClient from "./tokenB";
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

export function getTokenAClient(
  network: NetworkString,
  publicKey?: string,
): TokenAClient.Client {
  return new TokenAClient.Client({
    ...TokenAClient.networks.testnet,
    rpcUrl: chainConfig[network].sorobanUrl,
    allowHttp: true,
    publicKey,
  });
}

export function getTokenBClient(
  network: NetworkString,
  publicKey?: string,
): TokenBClient.Client {
  return new TokenBClient.Client({
    ...TokenBClient.networks.testnet,
    rpcUrl: chainConfig.TESTNET.sorobanUrl,
    allowHttp: true,
    publicKey,
  });
}
