import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useStETHByWstETH } from 'modules/web3';

export const useReceiveAmount = (amount: bigint | undefined, token: TOKENS) => {
  const { data: wsteth, isPending: wstethLoadng } = useStETHByWstETH(
    (token === TOKENS.wsteth && amount) || undefined,
  );

  return {
    amount: (token === TOKENS.wsteth ? wsteth : amount) ?? 0n,
    loading: token === TOKENS.wsteth ? wstethLoadng : false,
  };
};
