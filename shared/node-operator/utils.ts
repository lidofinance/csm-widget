import { ROLE_CODE, SHORT_ROLES } from 'consts/roles';
import { NodeOperatorInvite, NodeOperatorRoles } from 'types';

export const getShortRolesList = (
  no?: Partial<Omit<NodeOperatorRoles, 'id'>>,
) => {
  return [
    no?.rewards ? SHORT_ROLES.REWARDS : undefined,
    no?.manager ? SHORT_ROLES.MANAGER : undefined,
  ].filter(Boolean) as SHORT_ROLES[];
};

export const getRoleCode = ({
  rewards,
  manager,
}: Omit<NodeOperatorRoles, 'id'>) =>
  (((rewards && ROLE_CODE.REWARDS) || 0) +
    ((manager && ROLE_CODE.MANAGER) || 0)) as ROLE_CODE;

export const getInviteId = (no?: Partial<NodeOperatorInvite>) =>
  no?.id ? [no.id, ...getShortRolesList(no)].join('-') : undefined;
