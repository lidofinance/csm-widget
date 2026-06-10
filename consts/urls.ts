export const PATH = <const>{
  HOME: '/',

  CREATE: '/create',
  KEYS: '/keys',
  KEYS_SUBMIT: '/keys/submit',
  KEYS_REMOVE: '/keys/remove',
  KEYS_EJECT: '/keys/eject',
  KEYS_EXIT: '/keys/exit',
  KEYS_VIEW: '/keys/view',
  KEYS_NORMALIZE: '/keys/normalize',

  MONITORING: '/monitoring',

  BOND: '/bond',
  BOND_CLAIM: '/bond/claim',
  BOND_ADD: '/bond/add',
  BOND_REWARDS_HISTORY: '/bond/rewards-history',
  BOND_REBASE_HISTORY: '/bond/rebase-history',
  BOND_UNLOCK: '/bond/unlock',

  SETTINGS: '/settings',
  SETTINGS_ROLES: '/settings/roles',
  SETTINGS_REWARDS_ADDRESS: '/settings/rewards-address',
  SETTINGS_MANAGER_ADDRESS: '/settings/manager-address',
  SETTINGS_CLAIMER: '/settings/claimer',
  SETTINGS_SPLITS: '/settings/splits',
  SETTINGS_INBOX: '/settings/inbox',
  SETTINGS_METADATA: '/settings/metadata',

  DELAYED_PENALTY: '/delayed-penalty',
  DELAYED_PENALTY_REPORT: '/delayed-penalty/report',
  DELAYED_PENALTY_CANCEL: '/delayed-penalty/cancel',

  TYPE: '/type',
  TYPE_ICS_CLAIM: '/type/ics-claim',
  TYPE_ICS_SYSTEM: '/type/ics-system',
  TYPE_ICS_APPLY: '/type/ics-apply',
  TYPE_ICS_PARAMETERS: '/type/ics-parameters',
  TYPE_PARAMETERS: '/type/parameters',

  TYPE_DVT_DESCRIPTION: '/type/idvtc-description',
  TYPE_DVT_APPLY: '/type/idvtc-apply',
  TYPE_DVT_PARAMETERS: '/type/idvtc-parameters',
  TYPE_DVT_CLAIM: '/type/idvtc-claim',

  SURVEYS: '/surveys',
  SURVEYS_CONTACTS: '/surveys/contacts',
  SURVEYS_EXPERIENCE: '/surveys/experience',
  SURVEYS_HOW_DID_YOU_LEARN_CSM: '/surveys/learn-csm',
  SURVEYS_SETUP: '/surveys/setup',
  SURVEYS_DELEGATES: '/surveys/delegates',
  SURVEYS_DELEGATOR: '/surveys/delegator',

  GROUP: '/group',

  WRAPPED_SHARE: '/wrapped-2025/share',

  QA_CONFIG: '/qa-config',
};

export type PATH = (typeof PATH)[keyof typeof PATH];
