import { CHAINS } from '@lido-sdk/constants';
import { config } from 'config';

export const CSM_MAINNET_LINK = 'https://csm.lido.fi/';
export const CSM_TESTNET_LINK = 'https://csm.testnet.fi/';

type ExternalLinksConstants = {
  earlyAdoptionTree: string;
  rewardsTree: string;

  earlyAdoptionSources: string;
  earlyAdoptionAbout: string;
  feedbackForm: string;
  stakeWidget: string;

  beaconchain: string;
  feesMonitoring: string;
  operatorsWidget: string;
  beaconchainDashboard: string;
  subscribeEvents: string;
  keysApi: string;
};

export const EXTERNAL_LINKS_BY_NETWORK: Partial<
  Record<CHAINS, ExternalLinksConstants>
> = {
  [CHAINS.Mainnet]: {
    earlyAdoptionTree:
      'https://raw.githubusercontent.com/lidofinance/community-staking-module/main/artifacts/mainnet/early-adoption/merkle-tree.json',
    rewardsTree:
      'https://raw.githubusercontent.com/lidofinance/csm-rewards/mainnet/tree.json',
    earlyAdoptionSources:
      'https://github.com/lidofinance/community-staking-module/tree/main/artifacts/mainnet/early-adoption/sources',
    earlyAdoptionAbout:
      'https://operatorportal.lido.fi/modules/community-staking-module#block-ef60a1fa96ae4c7995dd7794de2a3e22',
    feedbackForm: 'https://forms.gle/GL9RYeV2g4px58Sv8',
    stakeWidget: 'https://stake.lido.fi',

    feesMonitoring: 'https://fees-monitoring.lido.fi',
    operatorsWidget: 'https://operators.lido.fi',
    beaconchain: 'https://beaconcha.in',
    beaconchainDashboard: '', // FIXME: link
    subscribeEvents: 'https://docs.lido.fi/staking-modules/csm/guides/events',
    keysApi: 'https://keys-api.lido.fi',
  },
  [CHAINS.Holesky]: {
    earlyAdoptionTree:
      'https://raw.githubusercontent.com/lidofinance/community-staking-module/main/artifacts/holesky/early-adoption/merkle-tree.json',
    rewardsTree:
      'https://raw.githubusercontent.com/lidofinance/csm-rewards/holesky/tree.json',
    earlyAdoptionSources:
      'https://github.com/lidofinance/community-staking-module/tree/main/artifacts/holesky/early-adoption/sources',
    earlyAdoptionAbout:
      'https://operatorportal.lido.fi/modules/community-staking-module#block-ef60a1fa96ae4c7995dd7794de2a3e22',
    feedbackForm: 'https://forms.gle/ZBUqbykaZokJLf4M7',
    stakeWidget: 'https://stake-holesky.testnet.fi',

    feesMonitoring: 'https://fees-monitoring-holesky.testnet.fi',
    operatorsWidget: 'https://operators-holesky.testnet.fi',
    beaconchain: 'https://holesky.beaconcha.in',
    beaconchainDashboard: 'https://v2-beta-holesky.beaconcha.in',
    subscribeEvents: 'https://docs.lido.fi/staking-modules/csm/guides/events',
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
