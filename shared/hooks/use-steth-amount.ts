import { TOKENS } from '@lidofinance/lido-csm-sdk/common';
import { useStETHByWstETH } from 'modules/web3';

export const useStethAmount = (token: TOKENS, amount = 0n) => {
  const { data: wstethToSteth } = useStETHByWstETH(
    (token === TOKENS.wsteth && amount) || undefined,
  );

  return token === TOKENS.wsteth ? wstethToSteth : amount;
};
