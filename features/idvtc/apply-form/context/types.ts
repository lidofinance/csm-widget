import { Address } from 'viem';

export type ClusterMember = {
  address: string;
  signature: string;
  verified?: boolean;
  discordHandle?: string;
  telegramUsername?: string;
};

export type IdvtcApplyFormInputType = {
  clusterMembers: ClusterMember[];
  discordLink: string;
  telegramUsername: string;
  confirmed: boolean;
};

export type IdvtcApplyFormNetworkData = {
  mainAddress: Address;
};
