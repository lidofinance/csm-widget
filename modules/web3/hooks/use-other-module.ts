import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from 'modules/web3';
import invariant from 'tiny-invariant';
import { Address } from 'viem';

export const useOtherModule = (address: Address | undefined) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['getShareLimit'],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(address);
      return csm.module.getUsedOtherModule(address);
    },
    enabled: !!address,
  });
};
