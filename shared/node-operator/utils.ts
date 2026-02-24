import { NodeOperatorInvite } from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts';

export const getInviteId = (invite: NodeOperatorInvite) =>
  `${ROLES_METADATA[invite.role].short}-${invite.id}` as const;
