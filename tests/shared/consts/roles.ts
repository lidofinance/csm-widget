export enum ROLES {
  MANAGER = 'MANAGER',
  REWARDS = 'REWARDS',
}
export const SHORT_ROLES = {
  [ROLES.REWARDS]: 'R',
  [ROLES.MANAGER]: 'M',
} as const;
