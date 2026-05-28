import { NodeOperatorInviteInfo } from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts';

export const getInviteId = (invite: NodeOperatorInviteInfo) =>
  `${ROLES_METADATA[invite.role].short}-${invite.nodeOperatorId}` as const;

export const formatGroupTitle = ({
  name,
  groupId,
}: {
  name: string;
  groupId: bigint;
}) => name || `Operator Group #${groupId}`;
