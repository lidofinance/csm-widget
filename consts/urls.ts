// TODO: part of PATH
export const SETTINGS_PATH = '/settings';

export const PATH = <const>{
  HOME: '/',
  CREATE: '/create',
  KEYS: '/keys',
  KEYS_SUBMIT: '/keys/submit',
  KEYS_REMOVE: '/keys/remove',
  KEYS_EJECT: '/keys/eject',
  KEYS_EXIT: '/keys/exit',
  KEYS_VIEW: '/keys/view',
  KEYS_TRANSFER: '/keys/transfer',
  KEYS_NORMALIZE: '/keys/normalize',
  MONITORING: '/monitoring',
  BOND: '/bond',
  BOND_CLAIM: '/bond/claim',
  BOND_ADD: '/bond/add',
  BOND_UNLOCK: '/bond/unlock',
  ROLES: '/roles',
  ROLES_REWARDS: '/roles/reward-address',
  ROLES_MANAGER: '/roles/manager-address',
  ROLES_INBOX: '/roles/inbox',
  STEALING: '/stealing',
  STEALING_REPORT: '/stealing/report',
  STEALING_CANCEL: '/stealing/cancel',
  TYPE: '/type',
  TYPE_CLAIM: '/type/claim',
  TYPE_ICS_SYSTEM: '/type/ics-system',
  TYPE_ICS_APPLY: '/type/ics-apply',

  SURVEYS: '/surveys',
  SURVEYS_CONTACTS: '/surveys/contacts',
  SURVEYS_EXPERIENCE: '/surveys/experience',
  SURVEYS_HOW_DID_YOU_LEARN_CSM: '/surveys/learn-csm',
  SURVEYS_SETUP: '/surveys/setup',
  SURVEYS_ALL: '/surveys/all',
};

export type PATH = (typeof PATH)[keyof typeof PATH];
