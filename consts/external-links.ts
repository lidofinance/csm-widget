import { CHAINS } from 'consts/chains';
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
  ratedExplorer: string;
  ethseerDashboard: string;
  ethseer: string;
  subscribeEvents: string;
  keysApi: string;
  surveyApi: string;
};

export const EXTERNAL_LINKS_BY_NETWORK: Record<CHAINS, ExternalLinksConstants> =
  {
    [CHAINS.Mainnet]: {
      earlyAdoptionTree:
        'https://raw.githubusercontent.com/lidofinance/community-staking-module/v1.0/artifacts/mainnet/early-adoption/merkle-tree.json',
      rewardsTree:
        'https://raw.githubusercontent.com/lidofinance/csm-rewards/mainnet/tree.json',
      earlyAdoptionSources:
        'https://github.com/lidofinance/community-staking-module/blob/v1.0/artifacts/mainnet/early-adoption/addresses.json',
      earlyAdoptionAbout:
        'https://operatorportal.lido.fi/modules/community-staking-module#block-ef60a1fa96ae4c7995dd7794de2a3e22',
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
    [CHAINS.Holesky]: {
      earlyAdoptionTree:
        'https://raw.githubusercontent.com/lidofinance/community-staking-module/v1.0/artifacts/holesky/early-adoption/merkle-tree.json',
      rewardsTree:
        'https://raw.githubusercontent.com/lidofinance/csm-rewards/holesky/tree.json',
      earlyAdoptionSources:
        'https://github.com/lidofinance/community-staking-module/blob/v1.0/artifacts/holesky/early-adoption/addresses.json',
      earlyAdoptionAbout:
        'https://operatorportal.lido.fi/modules/community-staking-module#block-ef60a1fa96ae4c7995dd7794de2a3e22',
      feedbackForm: 'https://forms.gle/ZBUqbykaZokJLf4M7',
      stakeWidget: 'https://stake-holesky.testnet.fi',

      feesMonitoring: 'https://fees-monitoring-holesky.testnet.fi',
      operatorsWidget: 'https://operators-holesky.testnet.fi',
      beaconchain: 'https://holesky.beaconcha.in',
      beaconchainDashboard: 'https://v2-beta-holesky.beaconcha.in/dashboard',
      ratedExplorer: '',
      ethseerDashboard: '',
      ethseer: '',
      subscribeEvents: 'https://docs.lido.fi/staking-modules/csm/guides/events',
      keysApi: 'https://keys-api-holesky.testnet.fi',
      surveyApi: '',
    },
    [CHAINS.Hoodi]: {
      earlyAdoptionTree: '',
      rewardsTree:
        'https://raw.githubusercontent.com/lidofinance/csm-rewards/hoodi/tree.json',
      earlyAdoptionSources: '',
      earlyAdoptionAbout: '',
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
  chainId: CHAINS | undefined = config.defaultChain,
) => {
  const links = EXTERNAL_LINKS_BY_NETWORK[chainId];
  if (!links) {
    throw new Error(`ExternalLinks for chain [${chainId}] are not specified`);
  }
  return links;
};
