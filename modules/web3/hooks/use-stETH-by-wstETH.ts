import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'modules/web3';
import invariant from 'tiny-invariant';

export const useStETHByWstETH = (wsteth: bigint | undefined | null) => {
  const { wrap } = useLidoSDK();

  return useQuery({
    queryKey: ['use-steth-by-wsteth', wsteth],
    enabled: wsteth != null && !!wrap,
    staleTime: Infinity,
    queryFn: () => {
      if (wsteth === 0n) return 0n;
      invariant(wsteth);

      return wrap.convertWstethToSteth(wsteth);
    },
  });
};
