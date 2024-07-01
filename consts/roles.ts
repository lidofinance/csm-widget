export const ROLES = {
  MANAGER: 'MANAGER',
  REWARDS: 'REWARDS',
} as const;

export type ROLES = keyof typeof ROLES;

export const SHORT_ROLES = {
  REWARDS: 'R',
  MANAGER: 'M',
} as const;

export type ShortRole = (typeof SHORT_ROLES)[keyof typeof SHORT_ROLES];
