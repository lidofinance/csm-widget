import { useCsmKeyRemovalFee, useMergeSwr } from 'shared/hooks';
import { useMemo } from 'react';

export const useRemovalFeeByKeysCount = (count: number) => {
  const swr = useCsmKeyRemovalFee();
  const data = useMemo(() => swr.data?.mul(count), [count, swr.data]);

  return useMergeSwr([swr], data);
};
