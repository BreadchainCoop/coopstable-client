import { Network } from '@/app/config';
import { YieldControllerService } from './yieldController';
import { YieldDistributorService } from './yieldDistributor';
import { SignTransaction } from '@stellar/stellar-sdk/contract';

export function yieldController(
  network: Network, 
  walletAddress: string, 
  signTransaction: SignTransaction
): YieldControllerService {
  return new YieldControllerService(network, walletAddress, signTransaction);
}

export function yieldDistributor(
  network: Network, 
  walletAddress: string
): YieldDistributorService {
  return new YieldDistributorService(network, walletAddress);
}