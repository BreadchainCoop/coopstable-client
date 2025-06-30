import { DEFAULT_NETWORK, Network, NetworkConfig, getNetworkConfig } from '@/app/config';
import { getCUSDManagerClient } from '@/app/contracts'; 
import { ICusdManagerService } from './types';

export class CUSDManagerService implements ICusdManagerService {
    private readonly config: NetworkConfig;
    constructor(
      network?: Network,
    ) {
      this.config = getNetworkConfig(network ?? DEFAULT_NETWORK);
      this.getTotalSupply = this.getTotalSupply.bind(this);
    }

    async getTotalSupply(): Promise<string | undefined> {
      const manager = getCUSDManagerClient(this.config.network);
      const totalSupply = await manager.cusd_total_supply();
      return totalSupply.result.valueOf().toString();
    }
  }