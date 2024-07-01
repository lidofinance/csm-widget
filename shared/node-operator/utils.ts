import { SHORT_ROLES, ShortRole } from 'consts/roles';
import { NodeOperatorInvite, NodeOperatorRoles } from 'types';

export const getShortRolesList = (
  no?: Partial<Omit<NodeOperatorRoles, 'id'>>,
) => {
  return [
    no?.rewards ? SHORT_ROLES.REWARDS : undefined,
    no?.manager ? SHORT_ROLES.MANAGER : undefined,
  ].filter(Boolean) as ShortRole[];
};

export const getInviteId = (no?: Partial<NodeOperatorInvite>) =>
  no?.id ? [no.id, ...getShortRolesList(no)].join('-') : undefined;
