export const MODULE = {
  CSM: 'csm',
  CM: 'cm',
} as const;

export type MODULE = (typeof MODULE)[keyof typeof MODULE];

export const MODULE_TITLE = {
  [MODULE.CSM]: 'Community Staking Module',
  [MODULE.CM]: 'Curated Module',
};
