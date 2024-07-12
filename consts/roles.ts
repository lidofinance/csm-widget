export const ROLES = {
  MANAGER: 'MANAGER',
  REWARDS: 'REWARDS',
} as const;

export type ROLES = keyof typeof ROLES;

export const SHORT_ROLES = {
  REWARDS: 'R',
  MANAGER: 'M',
} as const;

export type SHORT_ROLES = (typeof SHORT_ROLES)[keyof typeof SHORT_ROLES];

export const ROLE_CODE = {
  NONE: 0,
  REWARDS: 1,
  MANAGER: 2,
  BOTH: 3,
} as const;

export type ROLE_CODE = (typeof ROLE_CODE)[keyof typeof ROLE_CODE];
