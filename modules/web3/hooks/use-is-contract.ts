import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'modules/web3';
import { Address } from 'viem';

export const useIsContract = (address?: Address) => {
  const { core } = useLidoSDK();

  return useQuery({
    queryKey: ['use-is-contract', address],
    enabled: !!address,
    staleTime: Infinity,
    queryFn: () => {
      invariant(address);
      return core.isContract(address);
    },
  });
};
