import { Address } from 'viem';

export type ClusterMember = {
  address: string;
  signature: string;
  verified?: boolean;
  discordHandle?: string;
  telegramUsername?: string;
};

export type DvtApplyFormInputType = {
  clusterMembers: ClusterMember[];
  discordLink: string;
  telegramUsername: string;
  confirmed: boolean;
};

export type DvtApplyFormNetworkData = {
  mainAddress: Address;
};
