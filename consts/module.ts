import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { config } from 'config';

export const MODULE_METADATA = {
  [MODULE_NAME.CSM]: {
    title: 'Community Staking Module',
    shortTitle: 'CSM',
    shortName: 'CSM',
    description:
      'The Community Staking Module is a permissionless staking module aimed at attracting community stakers to participate in the Lido on Ethereum protocol as Node Operators',
    host: 'https://csm.lido.fi',
    previewFile: 'csm-preview.png',
  },
  [MODULE_NAME.CM]: {
    title: 'Curated Module',
    shortTitle: 'CM v2',
    shortName: 'CM',
    description:
      'The Curated Module v2 consists of allow-listed independent professional staking organizations and Ethereum client teams, which operate validators using the protocol',
    host: 'https://cm.testnet.fi', // TODO: replace to lido.fi when CM will be released
    previewFile: 'cm-preview.png',
  },
} as const;

export const moduleMeta = MODULE_METADATA[config.module];

export const isModuleCSM = config.module === MODULE_NAME.CSM;
export const isModuleCM = config.module === MODULE_NAME.CM;
