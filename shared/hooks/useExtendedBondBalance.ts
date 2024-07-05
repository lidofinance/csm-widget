import { useMemo } from 'react';
import { ROUNDING_TRESHOLD } from 'consts/treshhold';
import { BigNumber } from 'ethers';

export const useExtendedBondBalance = (
  required?: BigNumber,
  current?: BigNumber,
) => {
  return useMemo(() => {
    if (!current || !required) return undefined;

    const delta = current.sub(required);
    const isShortage = delta?.lt(0) ?? false;
    const isNoticiableShortage = delta?.lt(-ROUNDING_TRESHOLD) ?? false;
    const shortage = isShortage ? delta?.abs() : undefined;
    const excess = isShortage ? undefined : delta;

    return {
      required,
      current,
      delta,
      shortage,
      excess,
      isShortage,
      isNoticiableShortage,
    };
  }, [required, current]);
};
