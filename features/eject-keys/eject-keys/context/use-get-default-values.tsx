import { useCallback, useMemo } from 'react';
import { useAwaiter } from 'shared/hooks';
import { EjectKeysFormNetworkData } from './types';

// TODO: select invalid key
export const useGetDefaultValues = ({
  loading: { isKeysLoading, isInfoLoading },
}: EjectKeysFormNetworkData) => {
  const values = useMemo(() => {
    if (isKeysLoading || isInfoLoading) return undefined;
    return {
      selection: [],
      feeAmount: undefined,
    };
  }, [isInfoLoading, isKeysLoading]);

  const { awaiter } = useAwaiter(values);

  return useCallback(() => awaiter, [awaiter]);
};
