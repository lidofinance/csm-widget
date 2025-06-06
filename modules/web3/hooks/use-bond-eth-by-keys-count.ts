/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { useCurveId } from './use-curve-id';
import invariant from 'tiny-invariant';

export const useBondEthByKeysCount = (keysCount = 1) => {
  const { csm } = useLidoSDK();

  const { data: curveId } = useCurveId();

  return useQuery({
    queryKey: ['getBondAmountByKeysCountETH', { keysCount, curveId }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(curveId !== undefined);
      return csm.accounting.getBondAmountByKeysCountETH({
        keysCount: BigInt(keysCount),
        curveId,
      });
    },
    enabled: keysCount > 0 && curveId !== undefined,
  });
};
