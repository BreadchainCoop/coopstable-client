import { Network } from '@/app/config';
import { YieldControllerService } from './yieldController';
import { SignTransaction } from '@stellar/stellar-sdk/contract';

export function yieldController(
  network: Network, 
  walletAddress: string, 
  signTransaction: SignTransaction
): YieldControllerService {
  return new YieldControllerService(network, walletAddress, signTransaction);
}