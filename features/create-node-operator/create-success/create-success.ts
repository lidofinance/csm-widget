import {
  ROLES,
  type OPERATOR_TYPE,
  type TOKENS,
} from '@lidofinance/lido-csm-sdk';
import type { OperatorRef } from 'modules/web3/operator-provider/types';
import type { Address } from 'viem';

export type CreateSuccess = {
  address: Address;
  operator: OperatorRef;
  type: OPERATOR_TYPE;
  keys?: string[];
  bondAmount?: bigint;
  bondToken?: TOKENS;
  hasRole: boolean;
  hasManagerRole: boolean;
  txHash?: string;
};

export type CreateSuccessInput = Omit<
  CreateSuccess,
  'hasRole' | 'hasManagerRole'
> & { roles: ROLES[] };

export const getCreateSuccess = ({
  roles,
  ...rest
}: CreateSuccessInput): CreateSuccess => ({
  ...rest,
  hasRole: roles.length > 0,
  hasManagerRole: roles.includes(ROLES.MANAGER),
});

/** The success screen belongs to the wallet that created the operator */
export const resolveCreated = <T extends { address: string }>(
  created: T | undefined,
  address: string | undefined,
): T | undefined =>
  created && address && created.address.toLowerCase() === address.toLowerCase()
    ? created
    : undefined;
