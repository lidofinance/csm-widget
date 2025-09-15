import { CSM_SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { config } from 'config';

export const CSM_MAINNET_LINK = 'https://csm.lido.fi/';
export const CSM_TESTNET_LINK = 'https://csm.testnet.fi/';

export const HOW_TO_EXIT_VALIDATOR_LINK =
  'https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm/exiting-csm-validators';

export const ABOUT_DEPOSIT_DATA_LINK =
  'https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm';

export const HOW_TO_GENERATE_DEPOSIT_DATA_LINK =
  'https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm#key-settings-to-note';

export const PREPARE_HARDWARE_LINK =
  'https://dvt-homestaker.stakesaurus.com/hardware-and-systems-setup/hardware-and-system-requirements';

type ExternalLinksConstants = {
  rewardsTree: string;
  feedbackForm: string;
  stakeWidget: string;

  beaconchain: string;
  feesMonitoring: string;
  operatorsWidget: string;
  beaconchainDashboard: string;
  ratedExplorer: string;
  ethseerDashboard: string;
  ethseer: string;
  subscribeEvents: string;
  keysApi: string;
  surveyApi: string;
};

export const EXTERNAL_LINKS_BY_NETWORK: Record<
  CSM_SUPPORTED_CHAINS,
  ExternalLinksConstants
> = {
  [CHAINS.Mainnet]: {
    rewardsTree:
      'https://raw.githubusercontent.com/lidofinance/csm-rewards/mainnet/tree.json',
    feedbackForm: 'https://forms.gle/GL9RYeV2g4px58Sv8',
    stakeWidget: 'https://stake.lido.fi',

    feesMonitoring: 'https://fees-monitoring.lido.fi',
    operatorsWidget: 'https://operators.lido.fi',
    beaconchain: 'https://beaconcha.in',
    beaconchainDashboard: 'https://v2-beta-mainnet.beaconcha.in/dashboard',
    ratedExplorer: 'https://explorer.rated.network',
    ethseerDashboard: 'https://ethseer.io/entity',
    ethseer: 'https://ethseer.io',
    subscribeEvents: 'https://docs.lido.fi/staking-modules/csm/guides/events',
    keysApi: 'https://keys-api.lido.fi',
    surveyApi: 'https://csm-surveys-api-mainnet.up.railway.app',
  },
  [CHAINS.Hoodi]: {
    rewardsTree:
      'https://raw.githubusercontent.com/lidofinance/csm-rewards/hoodi/tree.json',
    feedbackForm: 'https://forms.gle/ZBUqbykaZokJLf4M7',
    stakeWidget: 'https://stake-hoodi.testnet.fi',

    feesMonitoring: 'https://fees-monitoring-hoodi.testnet.fi',
    operatorsWidget: 'https://operators-hoodi.testnet.fi',
    beaconchain: 'https://hoodi.beaconcha.in',
    beaconchainDashboard: 'https://v2-beta-hoodi.beaconcha.in/dashboard',
    ratedExplorer: '',
    ethseerDashboard: '',
    ethseer: 'https://ethseer.io',
    subscribeEvents: 'https://docs.lido.fi/staking-modules/csm/guides/events',
    keysApi: 'https://keys-api-hoodi.testnet.fi',
    surveyApi: 'https://csm-surveys-api-testnet.up.railway.app',
  },
};

export const getExternalLinks = (
  chainId = config.defaultChain as CSM_SUPPORTED_CHAINS,
) => {
  const links = EXTERNAL_LINKS_BY_NETWORK[chainId];
  if (!links) {
    throw new Error(`ExternalLinks for chain [${chainId}] are not specified`);
  }
  return links;
};
