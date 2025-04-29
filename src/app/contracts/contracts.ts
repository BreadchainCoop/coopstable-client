import { chainConfig } from "../config";
import { NetworkString } from "../services/userService";
import * as TokenAClient from "./tokenA";
import * as TokenBClient from "./tokenB";

export function getTokenAClient(
  network: NetworkString,
  publicKey?: string
): TokenAClient.Client {
  return new TokenAClient.Client({
    ...TokenAClient.networks.testnet,
    rpcUrl: chainConfig[network].sorobanUrl,
    allowHttp: true,
    publicKey,
  });
}

export function getTokenBClient(publicKey?: string): TokenBClient.Client {
  return new TokenBClient.Client({
    ...TokenBClient.networks.testnet,
    rpcUrl: chainConfig.TESTNET.sorobanUrl,
    allowHttp: true,
    publicKey,
  });
}
