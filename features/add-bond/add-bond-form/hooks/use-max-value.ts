import { Zero } from '@ethersproject/constants';
import { TOKENS } from 'consts/tokens';
import { useMemo } from 'react';
import { useAddBondFormData } from '../context';

export const useMaxValue = (token: TOKENS) => {
  const { etherBalance, stethBalance, wstethBalance } = useAddBondFormData();

  const max = useMemo(() => {
    switch (token) {
      case TOKENS.ETH:
        return etherBalance; // TODO: minus gas cost
      case TOKENS.STETH:
        return stethBalance;
      case TOKENS.WSTETH:
        return wstethBalance;
    }
  }, [etherBalance, stethBalance, token, wstethBalance]);

  return max ?? Zero;
};
