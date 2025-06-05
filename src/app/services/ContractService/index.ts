import { Operation, rpc, xdr } from '@stellar/stellar-sdk';
import { Network, getNetworkConfig } from '@/app/config';
import { YieldControllerContract } from './yieldControllerContract';
import { SignTransaction } from '@stellar/stellar-sdk/contract';
import { IYieldControllerContract } from './types';

export function yieldController(network: Network, walletAddress: string, signTransaction: SignTransaction): IYieldControllerContract {

  
  const config = getNetworkConfig(network);
  const stellarRpc = new rpc.Server(config.sorobanUrl);
  return new YieldControllerContract(network, walletAddress, stellarRpc, signTransaction);
}