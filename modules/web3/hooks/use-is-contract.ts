import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import { useLidoSDK } from 'modules/web3';
import invariant from 'tiny-invariant';
import { Address } from 'viem';

export const useIsContract = (address: Address | undefined) => {
  const { core } = useLidoSDK();

  return useQuery({
    queryKey: ['use-is-contract', address],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(address);
      return core.isContract(address);
    },
    enabled: !!address,
  });
};
