
import { Asset } from '@stellar/stellar-sdk';

export function requiresTrustline(
  asset: Asset,
  protocolAssets: Asset[],
): boolean {
  return !protocolAssets.some((protocolAsset) => protocolAsset.equals(asset)); 
}