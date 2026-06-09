import type { OperatorKey } from './types';

export const endpoints = {
  nonce: 'auth/nonce',
  signin: 'auth/signin',
  myDelegates: 'delegates/my',

  publicSummary: (op: OperatorKey) => `open/${op}` as const,

  contacts: (op: OperatorKey) => `${op}/contacts` as const,
  experience: (op: OperatorKey) => `${op}/experience` as const,
  howDidYouLearnCsm: (op: OperatorKey) =>
    `${op}/how-did-you-learn-csm` as const,
  summary: (op: OperatorKey) => `${op}/summary` as const,
  setups: (op: OperatorKey, id?: string | number) =>
    id !== undefined ? `${op}/setups/${id}` : `${op}/setups`,
  setupsKeys: (op: OperatorKey) => `${op}/setups/keys` as const,
  delegates: (op: OperatorKey) => `${op}/delegates` as const,
  delegate: (op: OperatorKey, address: string) =>
    `${op}/delegates/${address}` as const,

  icsStatus: 'ics/status',
  icsApply: 'ics/apply',
  dvtStatus: 'dvt/status',
  dvtApply: 'dvt/apply',
} as const;
