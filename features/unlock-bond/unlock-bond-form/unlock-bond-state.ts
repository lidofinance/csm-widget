import type { BondBalance } from '@lidofinance/lido-csm-sdk';
import { bigMin } from 'utils/bigint-utils';

export const getCompensationAmount = (
  bond: Pick<BondBalance, 'delta' | 'locked' | 'isInsufficient'> | undefined,
  isExpired: boolean,
): bigint =>
  !isExpired && bond && !bond.isInsufficient
    ? bigMin(bond.delta, bond.locked)
    : 0n;

export const getRemainingLockedBond = (
  locked: bigint,
  compensationAmount: bigint,
): bigint => locked - compensationAmount;
