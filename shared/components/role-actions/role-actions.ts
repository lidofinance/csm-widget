import { ROLES } from '@lidofinance/lido-csm-sdk';
import { isModuleCM } from 'consts';

const OWNER_COMMON_ACTIONS = [
  'Setting up rewards splits',
  ...(isModuleCM ? ['Changing name and description'] : []),
];

const OWNER_MANAGER_ACTIONS = [
  'Changing Rewards Address',
  ...OWNER_COMMON_ACTIONS,
];

const OWNER_REWARDS_ACTIONS = [
  'Resetting the Manager Address to the current Rewards Address',
  ...OWNER_COMMON_ACTIONS,
];

export const getRoleActions = (
  role: ROLES,
  extendedManagerPermissions: boolean,
): string[] => {
  const isOwner =
    (role === ROLES.MANAGER && extendedManagerPermissions) ||
    (role === ROLES.REWARDS && !extendedManagerPermissions);

  if (role === ROLES.MANAGER) {
    return [
      'Adding new keys',
      'Removing existing keys',
      'Adding extra bond amount',
      'Claiming bond and rewards to the Rewards Address',
      'Covering locked bond',
      'Proposing a new Manager Address',
      ...(isOwner ? OWNER_MANAGER_ACTIONS : []),
    ];
  }

  return [
    'Claiming bond and rewards',
    'Adding extra bond amount',
    'Covering locked bond',
    'Proposing a new Rewards Address',
    ...(isOwner ? OWNER_REWARDS_ACTIONS : []),
  ];
};
