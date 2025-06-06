import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import invariant from 'tiny-invariant';

export const useKeyRemovalFee = (curveId?: bigint) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['getKeysRemovalFee', { curveId }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(curveId !== undefined);
      return csm.accounting.getKeysRemovalFee(curveId);
    },
    enabled: curveId !== undefined,
  });
};
