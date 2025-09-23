import { CSM_SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { config } from 'config';

export const CSM_MAINNET_LINK = 'https://csm.lido.fi/';
export const CSM_TESTNET_LINK = 'https://csm.testnet.fi/';

// Documentation links
export const EXTENDED_MODE_LINK =
  'https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/operator-roles#extended-mode';
export const UNBONDED_VALIDATORS_LINK =
  'https://docs.lido.fi/run-on-lido/csm/troubleshooting/unbonded-validators';
export const MEV_STEALING_LINK =
  'https://docs.lido.fi/run-on-lido/csm/troubleshooting/mev-stealing';
export const PERFORMANCE_TIPS_LINK =
  'https://docs.lido.fi/run-on-lido/csm/best-practices/maximizing-uptime-and-performance/';
export const HOW_TO_EXIT_VALIDATOR_LINK =
  'https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores';
export const ABOUT_DEPOSIT_DATA_LINK =
  'https://docs.lido.fi/run-on-lido/csm/node-setup/';
export const HOW_TO_GENERATE_DEPOSIT_DATA_LINK =
  'https://docs.lido.fi/run-on-lido/csm/generating-validator-keys/';
export const PREPARE_HARDWARE_LINK =
  'https://dvt-homestaker.stakesaurus.com/hardware-and-systems-setup/hardware-and-system-requirements';
export const UPLOAD_DEPOSIT_DATA_LINK =
  'https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/upload-remove-view-validator-keys#upload-keys';
export const SUBSCRIBE_EVENTS_LINK =
  'https://docs.lido.fi/run-on-lido/csm/alerts-and-monitoring/expert-custom-alerts';

// Lido Operator Portal links
export const LIDO_OPERATOR_PORTAL_BASE =
  'https://operatorportal.lido.fi/modules/community-staking-module';
export const LIDO_OPERATOR_PORTAL_BONDS_INFO = `${LIDO_OPERATOR_PORTAL_BASE}#block-e4a6daadca12480d955524247f03f380`;
export const LIDO_OPERATOR_PORTAL_PERFORMANCE_ORACLE = `${LIDO_OPERATOR_PORTAL_BASE}#block-c6dc8d00f13243fcb17de3fa07ecc52c`;
export const LIDO_OPERATOR_PORTAL_STUCK_KEYS = `${LIDO_OPERATOR_PORTAL_BASE}#block-0ed61a4c0a5a439bbb4be20e814b4e38`;
export const LIDO_OPERATOR_PORTAL_DEPOSITS_FLOW = `${LIDO_OPERATOR_PORTAL_BASE}#block-90b8ff95edc64cf7a051584820219616`;

// Lido Execution Layer Rewards Vault
export const LIDO_REWARDS_VAULT_LINK =
  'https://etherscan.io/address/0x388C818CA8B9251b393131C08a736A67ccB19297';

type ExternalLinksConstants = {
  rewardsTree: string;
  feedbackForm: string;
  stakeWidget: string;

  beaconchain: string;
  feesMonitoring: string;
  operatorsWidget: string;
  beaconchainDashboard: string;
  ratedExplorer: string;
  migalabsDashboard: string;
  migalabs: string;
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
    migalabsDashboard: 'https://migalabs.io/entities',
    migalabs: 'https://migalabs.io',
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
    migalabsDashboard: '',
    migalabs: 'https://migalabs.io',
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
