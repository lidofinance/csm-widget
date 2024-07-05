import { useCsmKeyRemovalFee } from 'shared/hooks';
import { useMemo } from 'react';
import { mergeSwr } from 'utils';

export const useRemovalFeeByKeysCount = (count: number) => {
  const swr = useCsmKeyRemovalFee();
  const data = useMemo(() => swr.data?.mul(count), [count, swr.data]);

  return mergeSwr([swr], data);
};
