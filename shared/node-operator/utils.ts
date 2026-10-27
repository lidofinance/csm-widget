import { ROLES_METADATA } from 'consts';
import { OperatorRef } from 'modules/web3';
import { ModuleInvite } from 'modules/web3/hooks/types';

export const getInviteId = (invite: ModuleInvite) =>
  `${invite.module}-${ROLES_METADATA[invite.role].short}-${invite.nodeOperatorId}` as const;

export const isSameOperator = (a: OperatorRef, b: OperatorRef | undefined) =>
  !!b && a.nodeOperatorId === b.nodeOperatorId && a.module === b.module;

type GroupLike = {
  name: string;
  groupId: bigint;
};

export const formatGroupTitle = ({ name, groupId }: GroupLike) =>
  name || `Operator Group #${groupId}`;

export const formatGroupLabel = (group: GroupLike) =>
  group.name ? `${group.name} (#${group.groupId})` : formatGroupTitle(group);
