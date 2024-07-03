import { useCallback, useMemo } from 'react';
import { useAwaiter } from 'shared/hooks';
import { RemoveKeysFormNetworkData } from './types';

export const useGetDefaultValues = ({
  totalDepositedKeys,
  loading: { isKeysLoading, isInfoLoading },
}: RemoveKeysFormNetworkData) => {
  const values = useMemo(() => {
    if (isKeysLoading || isInfoLoading) return undefined;
    return {
      selection: {
        start: 0,
        count: 0,
      },
      offset: totalDepositedKeys || 0,
    };
  }, [isInfoLoading, isKeysLoading, totalDepositedKeys]);

  const { awaiter } = useAwaiter(values);

  const getDefaultValues = useCallback(
    () => (values ? Promise.resolve(values) : awaiter),
    [awaiter, values],
  );

  return { getDefaultValues };
};
