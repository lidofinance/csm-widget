import { CHAINS } from '@lido-sdk/constants';
import { config } from 'config';

type ExternalLinksConstants = {
  earlyAdoptionTree: string;
  rewardsTree: string;
  beaconchain: string;
  feesMonitoring: string;
  operatorsWidget: string;
  beaconchainDashboard: string;
  keysApi: string;
};

export const EXTERNAL_LINKS_BY_NETWORK: Partial<
  Record<CHAINS, ExternalLinksConstants>
> = {
  [CHAINS.Mainnet]: undefined,
  [CHAINS.Holesky]: {
    earlyAdoptionTree:
      'https://raw.githubusercontent.com/lidofinance/community-staking-module/main/artifacts/holesky/early-adoption/merkle-tree.json',
    rewardsTree:
      'https://raw.githubusercontent.com/lidofinance/csm-rewards/holesky/tree.json',
    feesMonitoring: 'https://fees-monitoring-holesky.testnet.fi',
    operatorsWidget: 'https://operators-holesky.testnet.fi',
    beaconchain: 'https://holesky.beaconcha.in',
    beaconchainDashboard: 'https://v2-beta-holesky.beaconcha.in',
    keysApi: 'https://keys-api-holesky.testnet.fi',
  },
};

export const getExternalLinks = (
  chainId: CHAINS | undefined = config.defaultChain,
) => {
  const links = EXTERNAL_LINKS_BY_NETWORK[chainId];
  if (!links) {
    throw new Error(`ExternalLinks for chain [${chainId}] are not specified`);
  }
  return links;
};
