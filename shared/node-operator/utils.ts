import {
  NodeOperator,
  NodeOperatorInvite,
  ROLES,
} from '@lidofinance/lido-csm-sdk';
import { ROLE_CODE } from 'consts/roles';
import { capitalize } from 'lodash';

const SHORT_ROLES = {
  [ROLES.REWARDS]: 'R',
  [ROLES.MANAGER]: 'M',
} as const;

const ROLE_TITLES = {
  [ROLES.MANAGER]: 'manager',
  [ROLES.REWARDS]: 'rewards',
} as const;

export const getShortRole = (role: ROLES) => SHORT_ROLES[role];

export const getRoleTitle = (role: ROLES, capitalized = false) => {
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
