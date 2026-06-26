import { ROLES } from '@lidofinance/lido-csm-sdk';

// `isCM` reflects the active operator's module.
// `false` (no active operator / CSM) is the baseline set of owner actions.
export const getRoleActions = (
  role: ROLES,
  extendedManagerPermissions: boolean,
  isCM: boolean,
): string[] => {
  const ownerCommonActions = [
    'Setting up rewards splits',
    ...(isCM ? ['Changing name and description'] : []),
  ];

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
      ...(isOwner ? ['Changing Rewards Address', ...ownerCommonActions] : []),
    ];
  }

  return [
    'Claiming bond and rewards',
    'Adding extra bond amount',
    'Covering locked bond',
    'Proposing a new Rewards Address',
    ...(isOwner
      ? [
          'Resetting the Manager Address to the current Rewards Address',
          ...ownerCommonActions,
        ]
      : []),
  ];
};
