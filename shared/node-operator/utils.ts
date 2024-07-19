import { ROLE_CODE, ROLES } from 'consts/roles';
import { NodeOperatorInvite, NodeOperatorRoles } from 'types';

const SHORT_ROLES = {
  [ROLES.REWARDS]: 'R',
  [ROLES.MANAGER]: 'M',
} as const;

export const getShortRole = (role: ROLES) => SHORT_ROLES[role];

export const getRoleCode = ({
  rewards,
  manager,
}: Omit<NodeOperatorRoles, 'id'>) =>
  (((rewards && ROLE_CODE.REWARDS) || 0) +
    ((manager && ROLE_CODE.MANAGER) || 0)) as ROLE_CODE;

export const getInviteId = (no?: Partial<NodeOperatorInvite>) =>
  no?.id ? [no.id, getRoleCode(no)].join('-') : undefined;
