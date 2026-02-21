import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { config } from 'config';

export const MODULE_METADATA = {
  [MODULE_NAME.CSM]: {
    title: 'Community Staking Module',
    shortTitle: 'CSM',
    shortName: 'CSM',
  },
  [MODULE_NAME.CM]: {
    title: 'Curated Module',
    shortTitle: 'CM v2',
    shortName: 'CM',
  },
  [MODULE_NAME.CSM0x02]: {
    title: 'Community Staking Module 0x02',
    shortTitle: 'CSM 0x02',
    shortName: 'CSM',
  },
} as const;

export const isModuleCSM = config.module === MODULE_NAME.CSM;
export const isModuleCM = config.module === MODULE_NAME.CM;
