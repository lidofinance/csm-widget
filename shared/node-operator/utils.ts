import { ROLE_CODE, ROLES } from 'consts/roles';
import { capitalize } from 'lodash';
import { NodeOperatorInvite, NodeOperatorRoles } from 'types';

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

// TODO: drop
export const getRoleCode = ({
  rewards,
  manager,
}: Omit<NodeOperatorRoles, 'id'>) =>
  (((rewards && ROLE_CODE.REWARDS) || 0) +
    ((manager && ROLE_CODE.MANAGER) || 0)) as ROLE_CODE;

export const getInviteId = (invite: NodeOperatorInvite) =>
  `${getShortRole(invite.role)}-${invite.id}` as const;
