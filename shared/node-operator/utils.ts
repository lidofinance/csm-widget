import { ROLES_METADATA } from 'consts';
import { OperatorRef } from 'modules/web3';
import { ModuleInvite } from 'modules/web3/hooks/types';

export const getInviteId = (invite: ModuleInvite) =>
  `${invite.module}-${ROLES_METADATA[invite.role].short}-${invite.nodeOperatorId}` as const;

export const isSameOperator = (a: OperatorRef, b: OperatorRef | undefined) =>
  !!b && a.nodeOperatorId === b.nodeOperatorId && a.module === b.module;

export const formatGroupTitle = ({
  name,
  groupId,
}: {
  name: string;
  groupId: bigint;
}) => name || `Operator Group #${groupId}`;
