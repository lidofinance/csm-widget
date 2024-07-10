import { Zero } from '@ethersproject/constants';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { useStethByWsteth } from 'shared/hooks';

export const useReceiveAmount = (amount: BigNumber | null, token: TOKENS) => {
  const { data: wsteth, loading: wstethLoadng } = useStethByWsteth(
    (token === TOKENS.WSTETH && amount) || undefined,
  );

  return {
    amount: (token === TOKENS.WSTETH ? wsteth : amount) ?? Zero,
    loading: token === TOKENS.WSTETH ? wstethLoadng : false,
  };
};
