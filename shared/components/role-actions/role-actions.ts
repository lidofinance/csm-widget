import { ROLES } from '@lidofinance/lido-csm-sdk';

const buildOwnerCommonActions = (isCsmFamily: boolean) => [
  'Setting up rewards splits',
  ...(isCsmFamily ? [] : ['Changing name and description']),
];

export const getRoleActions = (
  role: ROLES,
  extendedManagerPermissions: boolean,
  isCsmFamily: boolean,
): string[] => {
  const isOwner =
    (role === ROLES.MANAGER && extendedManagerPermissions) ||
    (role === ROLES.REWARDS && !extendedManagerPermissions);

  const ownerCommonActions = buildOwnerCommonActions(isCsmFamily);

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
