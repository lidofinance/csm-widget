import { useLocalStorage } from 'shared/hooks';
import { useDappStatus } from '../hooks';
import { CachedOperatorRef } from './types';

const readTransform = (value: any): CachedOperatorRef | undefined =>
  value && value.id != null && value.module
    ? { id: BigInt(value.id), module: value.module }
    : undefined;

export const useCachedId = () => {
  const { address } = useDappStatus();

  return useLocalStorage<CachedOperatorRef | undefined>(
    address ? `sm-no-${address}` : undefined,
    undefined,
    readTransform,
  );
};
