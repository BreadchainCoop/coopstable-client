import { DEFAULT_NETWORK, Network, NetworkConfig, getNetworkConfig } from '@/app/config';
import { getYieldDistributorClient } from '@/app/contracts'; 
import { IYieldDistributorService } from './types';

export class YieldDistributorService implements IYieldDistributorService {
    private readonly config: NetworkConfig;
    private readonly walletAddress: string | undefined;
    constructor(
      network?: Network,
      walletAddress?: string,
    ) {
      this.walletAddress = walletAddress;
      this.config = getNetworkConfig(network ?? DEFAULT_NETWORK);
      this.isDistributionAvailable = this.isDistributionAvailable.bind(this);
      this.getDistributionPeriod = this.getDistributionPeriod.bind(this);
      this.getNextDistributionTime = this.getNextDistributionTime.bind(this);
      this.getTotalMembers = this.getTotalMembers.bind(this);
      this.getTreasuryShare = this.getTreasuryShare.bind(this);
      this.timeBeforeNextDistribution = this.timeBeforeNextDistribution.bind(this);
      this.getDistributionRound = this.getDistributionRound.bind(this);
      this.getTotalDistributed = this.getTotalDistributed.bind(this);
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

    async timeBeforeNextDistribution(): Promise<number | undefined> {
      const yieldDistributor = getYieldDistributorClient(this.config.network, this.walletAddress);
      const nextDistributionTime = await yieldDistributor.time_before_next_distribution();
      return Number(nextDistributionTime.result.valueOf().toString());
    }

    async getDistributionRound(): Promise<number | undefined> {
      const yieldDistributor = getYieldDistributorClient(this.config.network, this.walletAddress);
      const distributionInfo = await yieldDistributor.get_distribution_info();
      return Number(distributionInfo.result.epoch.toString());
    }

    async getTotalMembers(): Promise<number | undefined> {
      const yieldDistributor = getYieldDistributorClient(this.config.network, this.walletAddress);
      const totalMembers = await yieldDistributor.list_members();
      return totalMembers.result.length;
    }

    async getTreasuryShare(): Promise<number | undefined> {
      const yieldDistributor = getYieldDistributorClient(this.config.network, this.walletAddress);
      const treasuryShare = await yieldDistributor.get_treasury_share();
      return treasuryShare.result.valueOf();
    }

    async getTotalDistributed(): Promise<string | undefined> {
      const yieldDistributor = getYieldDistributorClient(this.config.network, this.walletAddress);
      const totalDistributed = await yieldDistributor.get_total_distributed();
      return totalDistributed.result.valueOf().toString();
    }
  }
  

  



