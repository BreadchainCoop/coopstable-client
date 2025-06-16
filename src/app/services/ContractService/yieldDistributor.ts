import { Network, NetworkConfig, getNetworkConfig } from '@/app/config';
import { getYieldDistributorClient } from '@/app/contracts'; 
import { IYieldDistributorService } from './types';

export class YieldDistributorService implements IYieldDistributorService {
    private readonly config: NetworkConfig;
    private readonly walletAddress: string;
    constructor(
      network: Network,
      walletAddress: string,
    ) {
      this.walletAddress = walletAddress;
      this.config = getNetworkConfig(network);
      this.isDistributionAvailable = this.isDistributionAvailable.bind(this);
      this.getDistributionPeriod = this.getDistributionPeriod.bind(this);
      this.getNextDistributionTime = this.getNextDistributionTime.bind(this);
    }

    async isDistributionAvailable(): Promise<boolean> {
      const yieldDistributor = getYieldDistributorClient(this.config.network, this.walletAddress);
      const isDistributionAvailable = await yieldDistributor.is_distribution_available();
      return isDistributionAvailable.result.valueOf();
    }

    async getDistributionPeriod(): Promise<string | undefined> {
      const yieldDistributor = getYieldDistributorClient(this.config.network, this.walletAddress);
      const distributionPeriod = await yieldDistributor.get_distribution_period();
      return distributionPeriod.result.valueOf().toString();
    }

    async getNextDistributionTime(): Promise<string | undefined> {
      const yieldDistributor = getYieldDistributorClient(this.config.network, this.walletAddress);
      const nextDistributionTime = await yieldDistributor.get_next_distribution_time();
      return nextDistributionTime.result.valueOf().toString();
    }
  }
  

  



