import { Operation, rpc, xdr } from '@stellar/stellar-sdk';
import { Network, getNetworkConfig } from '@/app/config';
import { YieldControllerContract } from './yieldControllerContract';
import { SignTransaction } from '@stellar/stellar-sdk/contract';
import { IYieldControllerContract } from './types';

export function yieldController(
  network: Network, 
  walletAddress: string, 
  signTransaction: SignTransaction
): IYieldControllerContract {
  console.log('yieldController factory called with:', { network, walletAddress, signTransaction: !!signTransaction });
  
  const config = getNetworkConfig(network);
  console.log('Config from factory:', config);
  
  const stellarRpc = new rpc.Server(config.sorobanUrl);
  console.log('RPC server created:', config.sorobanUrl);
  
  const instance = new YieldControllerContract(network, walletAddress, stellarRpc, signTransaction);
  console.log('YieldControllerContract instance created');
  
  return instance;
}