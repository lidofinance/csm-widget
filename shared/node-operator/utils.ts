import { ROLE_CODE, ROLES } from 'consts/roles';
import { capitalize } from 'lodash';
import { NodeOperator, NodeOperatorInvite } from 'types';

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
  const getRoleCode = (role: ROLES, code: ROLE_CODE) =>
    (Number(nodeOperator?.roles.includes(role)) * code) as ROLE_CODE;
  return (getRoleCode(ROLES.REWARDS, ROLE_CODE.REWARDS) +
    getRoleCode(ROLES.MANAGER, ROLE_CODE.MANAGER)) as ROLE_CODE;
};

export const getInviteId = (invite: NodeOperatorInvite) =>
  `${getShortRole(invite.role)}-${invite.id}` as const;
