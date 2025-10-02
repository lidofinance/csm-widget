import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useInvalidate = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (queryKeys: QueryKey[]) => {
      queryKeys.forEach((queryKey) =>
        queryClient.invalidateQueries({
          queryKey,
        }),
      );
    },
    [queryClient],
  );
};
