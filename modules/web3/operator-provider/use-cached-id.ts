import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useLocalStorage } from 'shared/hooks';
import { useDappStatus } from '../hooks';
import { CachedOperatorRef } from './types';

const isModuleName = (value: unknown): value is MODULE_NAME =>
  Object.values(MODULE_NAME).includes(value as MODULE_NAME);

// localStorage is user-tamperable: reject any value whose module isn't a real
// MODULE_NAME so a corrupted entry can't route SDK calls to the wrong module.
const readTransform = (value: any): CachedOperatorRef | undefined =>
  value && value.id != null && isModuleName(value.module)
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
