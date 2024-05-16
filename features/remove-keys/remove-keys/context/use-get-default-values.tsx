import { useCallback, useMemo } from 'react';
import { useAwaiter } from 'shared/hooks';
import { RemoveKeysFormNetworkData } from './types';

export const useGetDefaultValues = ({
  keys,
  totalDepositedKeys,
}: RemoveKeysFormNetworkData) => {
  const values = useMemo(() => {
    return keys && totalDepositedKeys
      ? {
          start: 0,
          count: 0,
          offset: totalDepositedKeys,
        }
      : undefined;
  }, [keys, totalDepositedKeys]);

  const { awaiter } = useAwaiter(values);
  // TODO: error resolver
  // useEffect(() => {
  //   if (error && !resolver.isResolved) {
  //     resolver.resolve({ requests: [], selectedTokens: [] });
  //   }
  // }, [resolver, error]);

  // FIXME:
  const getDefaultValues = useCallback(
    () => (values ? Promise.resolve(values) : awaiter),
    [awaiter, values],
  );

  return { getDefaultValues };
};
