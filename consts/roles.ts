export const ROLES = {
  MANAGER: 'MANAGER',
  REWARD: 'REWARD',
} as const;

export type ROLES = keyof typeof ROLES;
