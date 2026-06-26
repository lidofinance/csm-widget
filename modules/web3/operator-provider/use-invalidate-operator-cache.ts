import { useQueryClient } from '@tanstack/react-query';
import { useLidoSDK } from 'modules/web3/web3-provider';
import { useCallback } from 'react';

type InvalidationScope = 'operator' | 'address' | 'operatorAndAddress';

export const useInvalidateOperatorCache = () => {
  const queryClient = useQueryClient();
  const { csm, cm } = useLidoSDK();

  return useCallback(
    (scope: InvalidationScope = 'operatorAndAddress') => {
      csm.core.invalidateCache();
      cm.core.invalidateCache();
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some((part) => {
            if (typeof part !== 'object' || part === null) return false;
            if (scope === 'operator') return 'nodeOperatorId' in part;
            if (scope === 'address') return 'address' in part;
            return 'operator' in part || 'nodeOperatorId' in part;
          }),
      });
    },
    [csm.core, cm.core, queryClient],
  );
};
