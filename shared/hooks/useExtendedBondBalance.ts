import { Zero } from '@ethersproject/constants';
import { ROUNDING_TRESHOLD } from 'consts/treshhold';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { BondBalance } from 'types';

export const useExtendedBondBalance = (
  required?: BigNumber,
  current?: BigNumber,
  locked: BigNumber = Zero,
) => {
  return useMemo(() => {
    if (!current || !required) return undefined;

    const requiredWithoutLocked = required.sub(locked);

    const delta = current.sub(requiredWithoutLocked);
    const isInsufficient = delta?.lt(0) ?? false;
    const isNoticiableInsufficient = delta?.lt(-ROUNDING_TRESHOLD) ?? false;

    return {
      required: requiredWithoutLocked,
      current,
      locked,
      delta: delta.abs(),
      isInsufficient,
      isNoticiableInsufficient,
    } as BondBalance;
  }, [required, current, locked]);
};
