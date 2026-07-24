import { ROLES } from '@lidofinance/lido-csm-sdk';

export const ROLES_METADATA = {
  [ROLES.REWARDS]: {
    short: 'R',
    title: 'rewards',
    capitalizedTitle: 'Rewards',
  },
  [ROLES.MANAGER]: {
    short: 'M',
    title: 'manager',
    capitalizedTitle: 'Manager',
  },
};

export const getRoleTitle = (role: ROLES, capitalized = false) => {
  return capitalized
    ? ROLES_METADATA[role].capitalizedTitle
    : ROLES_METADATA[role].title;
};
