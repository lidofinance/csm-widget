import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'modules/web3';

export const useWstethBySteth = (steth?: bigint | null) => {
  const { wrap } = useLidoSDK();

  return useQuery({
    queryKey: ['use-wsteth-by-steth', steth],
    enabled: steth != null && !!wrap,
    staleTime: Infinity,
    queryFn: () => {
      if (steth === 0n) return 0n;
      invariant(steth);

      return wrap.convertStethToWsteth(steth);
    },
  });
};
