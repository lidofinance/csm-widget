import type { NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { isAddressEqual, type Address } from 'viem';

// CLAIMER is not a first-class role: only manager/rewards make the wallet "an operator".
export const hasOperatorRole = (
  operator: Pick<NodeOperatorShortInfo, 'managerAddress' | 'rewardsAddress'>,
  address: Address | undefined,
): boolean =>
  !!address &&
  (isAddressEqual(operator.managerAddress, address) ||
    isAddressEqual(operator.rewardsAddress, address));
