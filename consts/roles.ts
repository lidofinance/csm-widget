// TODO: rename to ROLE
export const ROLES = {
  MANAGER: 'MANAGER',
  REWARDS: 'REWARDS',
} as const;

export type ROLES = keyof typeof ROLES;

// TODO: spectacular
export const ROLE_CODE = {
  NONE: 0,
  REWARDS: 1,
  MANAGER: 2,
  REWARDS_AND_MANAGER: 3,
} as const;

export type ROLE_CODE = (typeof ROLE_CODE)[keyof typeof ROLE_CODE];

export enum OPERATOR_TYPE {
  PLS = 'PLS',
  LEA = 'LEA',
  ICS = 'ICS',
  CC = 'CC',
}
