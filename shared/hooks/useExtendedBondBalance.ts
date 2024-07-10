import { ROUNDING_TRESHOLD } from 'consts/treshhold';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { BondBalance } from 'types';

export const useExtendedBondBalance = (
  required?: BigNumber,
  current?: BigNumber,
) => {
  return useMemo(() => {
    if (!current || !required) return undefined;

    const delta = current.sub(required);
    const isShortage = delta?.lt(0) ?? false;
    const isNoticiableShortage = delta?.lt(-ROUNDING_TRESHOLD) ?? false;

    return {
      required,
      current,
      delta: delta.abs(),
      isShortage,
      isNoticiableShortage,
    } as BondBalance;
  }, [required, current]);
};
