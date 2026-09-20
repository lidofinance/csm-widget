import { useQueryClient } from '@tanstack/react-query';
import { useLidoSDK } from 'modules/web3/web3-provider';
import { useCallback } from 'react';
import {
  matchesInvalidationScope,
  type InvalidationScope,
} from './match-invalidation-scope';

export const useInvalidateOperatorCache = () => {
  const queryClient = useQueryClient();
  const { sm } = useLidoSDK();

  return useCallback(
    (scope: InvalidationScope = 'operatorAndAddress') => {
      Object.values(sm).forEach((sdk) => sdk?.core.invalidateCache());
      void queryClient.invalidateQueries({
        predicate: (query) => matchesInvalidationScope(query.queryKey, scope),
      });
    },
    [sm, queryClient],
  );
};
