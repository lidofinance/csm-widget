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
  BOTH: 3,
} as const;

export type ROLE_CODE = (typeof ROLE_CODE)[keyof typeof ROLE_CODE];
