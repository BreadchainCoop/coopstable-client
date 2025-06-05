
import { Asset, Horizon } from '@stellar/stellar-sdk';

export function requiresTrustline(
  account: Horizon.AccountResponse | undefined,
  asset: Asset | undefined
): boolean {
  // no trustline required for unloaded account or asset
  if (!account || !asset) return false;
  /** @TODO this condition can prolly be improved */
  return !account.balances.some((balance) => {
    if (balance.asset_type == 'native') {
      return asset.isNative();
    }
    // @ts-ignore
    return balance.asset_code === asset.getCode() && balance.asset_issuer === asset.getIssuer();
  });
}