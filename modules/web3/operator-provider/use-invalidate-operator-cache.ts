import { useQueryClient } from '@tanstack/react-query';
import { useSmSDK } from 'modules/web3/web3-provider';
import { useCallback } from 'react';
import {
  matchesInvalidationScope,
  type InvalidationScope,
} from './match-invalidation-scope';

export const useInvalidateOperatorCache = () => {
  const queryClient = useQueryClient();
  const sdk = useSmSDK();

  return useCallback(
    (scope: InvalidationScope = 'operatorAndAddress') => {
      sdk.core.invalidateCache();
      void queryClient.invalidateQueries({
        predicate: (query) => matchesInvalidationScope(query.queryKey, scope),
      });
    },
    [sdk.core, queryClient],
  );
};
