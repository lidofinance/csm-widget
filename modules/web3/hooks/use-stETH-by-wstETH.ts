import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { useDappStatus, useLidoSDK } from 'modules/web3';

export const useStETHByWstETH = (wsteth?: bigint | null) => {
  const { chainId } = useDappStatus();
  const { wrap } = useLidoSDK();

  return useQuery({
    queryKey: ['use-steth-by-wsteth', wsteth?.toString(), chainId],
    enabled: wsteth != null && !!wrap,
    staleTime: Infinity,
    queryFn: () => {
      if (wsteth === 0n) return 0n;
      invariant(wsteth);

      return wrap.convertWstethToSteth(wsteth);
    },
  });
};
