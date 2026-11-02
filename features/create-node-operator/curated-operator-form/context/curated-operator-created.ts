import {
  MODULE_NAME,
  type NodeOperatorId,
  ROLES,
} from '@lidofinance/lido-csm-sdk';
import type { OperatorRef } from 'modules/web3/operator-provider/types';
import type { Address } from 'viem';

export type CuratedOperatorCreated = {
  address: Address;
  operator: OperatorRef;
  hasRole: boolean;
  hasManagerRole: boolean;
  availableGatesCount: number;
};

export type CuratedOperatorCreatedInput = {
  address: Address;
  nodeOperatorId: NodeOperatorId;
  roles: ROLES[];
  availableGatesCount: number;
};

export const buildCuratedOperatorCreated = ({
  address,
  nodeOperatorId,
  roles,
  availableGatesCount,
}: CuratedOperatorCreatedInput): CuratedOperatorCreated => ({
  address,
  operator: { nodeOperatorId, module: MODULE_NAME.CM },
  hasRole: roles.length > 0,
  hasManagerRole: roles.includes(ROLES.MANAGER),
  availableGatesCount,
});
