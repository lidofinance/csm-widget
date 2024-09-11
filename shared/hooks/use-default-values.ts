import { useCallback } from 'react';
import { useAwaiter } from 'shared/hooks';

export const useDefaultValues = <T>(values: T | undefined) => {
  const { awaiter } = useAwaiter(values);

  return useCallback(() => awaiter, [awaiter]);
};
