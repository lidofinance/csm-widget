import { Zero } from '@ethersproject/constants';
import { ROUNDING_THRESHOLD } from 'consts/treshhold';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { BondBalance } from 'types';

export const useExtendedBondBalance = (
  required?: BigNumber,
  current?: BigNumber,
  locked: BigNumber = Zero,
): BondBalance | undefined =>
  useMemo(() => {
    if (!current || !required) return undefined;

    const requiredWithoutLocked = required.sub(locked);

    let delta = current.sub(requiredWithoutLocked);
    if (delta?.lt(0) && delta?.abs().lt(ROUNDING_THRESHOLD)) {
      delta = Zero;
    }

    const isInsufficient = delta?.lt(0) ?? false;

    return {
      required: requiredWithoutLocked,
      current,
      locked,
      delta: delta.abs(),
      isInsufficient,
    };
  }, [required, current, locked]);
