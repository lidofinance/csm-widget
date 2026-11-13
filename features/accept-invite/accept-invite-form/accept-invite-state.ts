import type { NodeOperatorId, ROLES } from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts';
import type { ModuleInvite } from 'modules/web3';
import { getInviteId } from 'shared/node-operator/utils';

export const findInviteById = (
  invites: ModuleInvite[] | undefined,
  id: string | undefined,
) => (id ? invites?.find((invite) => getInviteId(invite) === id) : undefined);

export type NavigateHomeInput = {
  nodeOperatorId?: NodeOperatorId;
  invitesCount: number;
};

export const shouldNavigateHomeAfterAccept = ({
  nodeOperatorId,
  invitesCount,
}: NavigateHomeInput) => nodeOperatorId === undefined && invitesCount <= 1;

export const getProposedRoleText = (role: ROLES) =>
  `Proposed role: ${ROLES_METADATA[role].capitalizedTitle} Address`;
