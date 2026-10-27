import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  matchesInvalidationScope,
  type InvalidationScope,
} from './match-invalidation-scope';

export const useInvalidateOperatorCache = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (scope: InvalidationScope = 'operatorAndAddress') => {
      void queryClient.invalidateQueries({
        predicate: (query) => matchesInvalidationScope(query.queryKey, scope),
      });
    },
    [queryClient],
  );
};
