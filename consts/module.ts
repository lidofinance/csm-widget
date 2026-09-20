import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';

export const WIDGET_TITLE = 'Operators';
export const WIDGET_DESCRIPTION =
  'Manage your Lido Node Operator across the Community Staking and Curated modules';
export const WIDGET_HOST = 'https://csm.lido.fi';
export const WIDGET_PREVIEW_FILE = 'operators-preview.png';

const CSM_METADATA = {
  title: 'Community Staking Module',
  shortTitle: 'CSM',
  shortName: 'CSM',
  description:
    'The Community Staking Module is a permissionless staking module aimed at attracting community stakers to participate in the Lido on Ethereum protocol as Node Operators',
} as const;

export const MODULE_METADATA = {
  [MODULE_NAME.CSM]: CSM_METADATA,
  [MODULE_NAME.CM]: {
    title: 'Curated Module',
    shortTitle: 'CM v2',
    shortName: 'CM',
    description:
      'The Curated Module v2 consists of allow-listed independent professional staking organizations and Ethereum client teams, which operate validators using the protocol',
  },
  [MODULE_NAME.CSM_02]: CSM_METADATA,
} as const;
