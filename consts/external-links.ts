import { PerModule, SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { config } from 'config';

export const CSM_MAINNET_LINK = 'https://csm.lido.fi/';
export const CSM_TESTNET_LINK = 'https://csm.testnet.fi/';
export const CM_MAINNET_LINK = 'https://cm.lido.fi/';
export const CM_TESTNET_LINK = 'https://cm.testnet.fi/';

// Documentation links
export const EXTENDED_MODE_LINK =
  'https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/operator-roles#extended-mode';
export const UNBONDED_VALIDATORS_LINK =
  'https://docs.lido.fi/run-on-lido/csm/troubleshooting/unbonded-validators';
export const CSM_DOCS_LINK = 'https://docs.lido.fi/run-on-lido/csm/';
export const MEV_STEALING_LINK =
  'https://docs.lido.fi/run-on-lido/csm/troubleshooting/mev-stealing';
export const PERFORMANCE_TIPS_LINK =
  'https://docs.lido.fi/run-on-lido/csm/best-practices/maximizing-uptime-and-performance/';
export const HOW_TO_EXIT_VALIDATOR_LINK =
  'https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores';
export const UPLOAD_DEPOSIT_DATA_LINK =
  'https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/upload-remove-view-validator-keys#upload-keys';
export const SUBSCRIBE_EVENTS_LINK =
  'https://docs.lido.fi/run-on-lido/csm/alerts-and-monitoring/expert-custom-alerts';
export const OPERATOR_TYPES_LINK =
  'https://docs.lido.fi/staking-modules/csm/join-csm/#node-operator-types';
export const CM_BOND_AMOUNTS_LINK =
  'https://docs.lido.fi/run-on-lido/cm-v2/bond-and-key-management#bond-amounts';
export const FEE_RECIPIENT_LINK =
  'https://docs.lido.fi/run-on-lido/csm/troubleshooting/setting-the-fee-recipient-for-csm-validators/#change-fee-recipient-on-existing-validator-keys';

// Lido Operator Portal links
export const LIDO_OPERATOR_PORTAL_BASE =
  'https://operatorportal.lido.fi/modules/community-staking-module';
export const LIDO_OPERATOR_PORTAL_CM =
  'https://operatorportal.lido.fi/modules/curated-module-v2-1';
export const LIDO_OPERATOR_PORTAL_SDVT =
  'https://operatorportal.lido.fi/modules/simple-dvt-module';
export const LIDO_OPERATOR_PORTAL_CURATED =
  'https://operatorportal.lido.fi/modules/curated-module';
export const LIDO_OPERATOR_PORTAL_PERFORMANCE_ORACLE = `${LIDO_OPERATOR_PORTAL_BASE}#block-c6dc8d00f13243fcb17de3fa07ecc52c`;
export const LIDO_OPERATOR_PORTAL_DEPOSITS_FLOW = `${LIDO_OPERATOR_PORTAL_BASE}#block-90b8ff95edc64cf7a051584820219616`;
export const PHASED_DEPOSIT_APPROACH_LINK =
  'https://research.lido.fi/t/0x02-csm-landscape/11697/10';

// Lido Execution Layer Rewards Vault
export const LIDO_REWARDS_VAULT_LINK =
  'https://etherscan.io/address/0x388C818CA8B9251b393131C08a736A67ccB19297';

type ExternalLinksConstants = {
  rewardsTree: string;
  feedbackForm: PerModule<string>;
  stakeWidget: string;
  landing: PerModule<string>;

  beaconchain: string;
  feesMonitoring: string;
  operatorsWidget: string;
  ratedExplorer: string;
  migalabsDashboard: string;
  migalabs: string;
  keysApi: string;
  surveyApi: string;
  ethApi: string;
};

export const EXTERNAL_LINKS_BY_NETWORK: Record<
  SUPPORTED_CHAINS,
  ExternalLinksConstants
> = {
  [CHAINS.Mainnet]: {
    rewardsTree:
      'https://raw.githubusercontent.com/lidofinance/csm-rewards/mainnet/tree.json',
    feedbackForm: {
      CSM: 'https://forms.gle/GL9RYeV2g4px58Sv8',
      CSM_02: 'https://forms.gle/GL9RYeV2g4px58Sv8',
      CM: 'https://forms.gle/4oRG7XwhNJszhJvv6',
    },
    stakeWidget: 'https://stake.lido.fi',
    landing: {
      CSM: 'https://lido.fi/csm',
      CSM_02: 'https://lido.fi/csm',
      CM: LIDO_OPERATOR_PORTAL_CM,
    },

    feesMonitoring: 'https://fees-monitoring.lido.fi',
    operatorsWidget: 'https://operators.lido.fi',
    beaconchain: 'https://beaconcha.in',
    ratedExplorer: 'https://explorer.rated.network',
    migalabsDashboard: 'https://migalabs.io/entities',
    migalabs: 'https://migalabs.io',
    keysApi: 'https://keys-api.lido.fi',
    surveyApi: 'https://csm-survey-api.lido.tools',
    ethApi: 'https://eth-api.lido.fi',
  },
  [CHAINS.Hoodi]: {
    rewardsTree:
      'https://raw.githubusercontent.com/lidofinance/csm-rewards/hoodi/tree.json',
    feedbackForm: {
      CSM: 'https://forms.gle/ZBUqbykaZokJLf4M7',
      CSM_02: 'https://forms.gle/ZBUqbykaZokJLf4M7',
      CM: 'https://forms.gle/Lhh4fGXvx7Gwcd6e7',
    },
    stakeWidget: 'https://stake-hoodi.testnet.fi',
    landing: {
      CSM: 'https://testnet.fi/csm',
      CSM_02: 'https://testnet.fi/csm',
      CM: 'https://testnet.fi/cm',
    },

    feesMonitoring: 'https://fees-monitoring-hoodi.testnet.fi',
    operatorsWidget: 'https://operators-hoodi.testnet.fi',
    beaconchain: 'https://hoodi.beaconcha.in',
    ratedExplorer: '',
    migalabsDashboard: '',
    migalabs: '',
    keysApi: 'https://keys-api-hoodi.testnet.fi',
    surveyApi: 'https://csm-survey-api-hoodi.lido.tools',
    ethApi: 'https://eth-api-hoodi.testnet.fi',
  },
};

export const getExternalLinks = (chainId = config.defaultChain) => {
  const links = EXTERNAL_LINKS_BY_NETWORK[chainId];
  if (!links) {
    throw new Error(`ExternalLinks for chain [${chainId}] are not specified`);
  }
  return links;
};
