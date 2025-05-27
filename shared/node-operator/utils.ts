import { NodeOperator, ROLES } from '@lidofinance/lido-csm-sdk/common';
import { ROLE_CODE, ROLES as LOCAL_ROLES } from 'consts/roles';
import { capitalize } from 'lodash';
import { NodeOperatorInvite } from 'types';

const SHORT_ROLES = {
  [LOCAL_ROLES.REWARDS]: 'R',
  [LOCAL_ROLES.MANAGER]: 'M',
} as const;

const ROLE_TITLES = {
  [LOCAL_ROLES.MANAGER]: 'manager',
  [LOCAL_ROLES.REWARDS]: 'rewards',
} as const;

export const getShortRole = (role: LOCAL_ROLES) => SHORT_ROLES[role];

export const getRoleTitle = (role: LOCAL_ROLES, capitalized = false) => {
  const text = ROLE_TITLES[role];
  return capitalized ? capitalize(text) : text;
};

export const getRoleCode = (nodeOperator?: NodeOperator) => {
  switch (true) {
    case nodeOperator?.roles.includes(ROLES.MANAGER) &&
      nodeOperator?.roles.includes(ROLES.REWARDS):
      return ROLE_CODE.REWARDS_AND_MANAGER;
    case nodeOperator?.roles.includes(ROLES.MANAGER):
      return ROLE_CODE.MANAGER;
    case nodeOperator?.roles.includes(ROLES.REWARDS):
      return ROLE_CODE.REWARDS;
    default:
      return ROLE_CODE.NONE;
  }
};

export const getInviteId = (invite: NodeOperatorInvite) =>
  `${getShortRole(invite.role)}-${invite.id}` as const;
