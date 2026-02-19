import { config } from 'config';

// FIXME: replace with MODULE_NAME from SDK
// TODO: reduce direct usage
export const MODULE = {
  CSM: 'csm',
  CM: 'cm',
} as const;

export type MODULE = (typeof MODULE)[keyof typeof MODULE];

export const MODULE_TITLE = {
  [MODULE.CSM]: 'Community Staking Module',
  [MODULE.CM]: 'Curated Module',
} as const;

export const MODULE_SHORT_TITLE = {
  [MODULE.CSM]: 'CSM',
  [MODULE.CM]: 'CM v2',
} as const;

export const MODULE_SHORT_NAME = {
  [MODULE.CSM]: 'CSM',
  [MODULE.CM]: 'CM',
} as const;

export const isModuleCSM = config.module === MODULE.CSM;
export const isModuleCM = config.module === MODULE.CM;
