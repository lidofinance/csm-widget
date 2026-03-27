import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useSmSDK } from 'modules/web3/web3-provider';

type InvalidationScope = 'operator' | 'address' | 'operatorAndAddress';

export const useInvalidateOperatorCache = () => {
  const queryClient = useQueryClient();
  const sdk = useSmSDK();

  return useCallback(
    (scope: InvalidationScope = 'operatorAndAddress') => {
      sdk.core.invalidateCache();
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
    [sdk.core, queryClient],
  );
};
