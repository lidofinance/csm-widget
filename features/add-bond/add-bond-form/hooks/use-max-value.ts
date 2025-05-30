import { useMemo } from 'react';
import { useAddBondFormData } from '../context';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';

export const useMaxValue = (token: TOKENS) => {
  const { ethBalance, stethBalance, wstethBalance } = useAddBondFormData();

  const max = useMemo(() => {
    switch (token) {
      case TOKENS.eth:
        return ethBalance; // TODO: minus gas cost
      case TOKENS.steth:
        return stethBalance;
      case TOKENS.wsteth:
        return wstethBalance;
    }
  }, [ethBalance, stethBalance, token, wstethBalance]);

  return max ?? 0n;
};
