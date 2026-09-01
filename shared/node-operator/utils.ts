import { ROLES_METADATA } from 'consts';
import { ModuleInvite } from 'modules/web3/hooks/types';

export const getInviteId = (invite: ModuleInvite) =>
  `${invite.module}-${ROLES_METADATA[invite.role].short}-${invite.nodeOperatorId}` as const;

export const formatGroupTitle = ({
  name,
  groupId,
}: {
  name: string;
  groupId: bigint;
}) => name || `Operator Group #${groupId}`;
