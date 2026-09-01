import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';
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

// One selection per address across all deployed modules: the chosen module
// lives in the value, not the key.
export const getCachedOperatorKey = (address: Address) => `sm-no-${address}`;

export const clearCachedOperator = (address: Address) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(getCachedOperatorKey(address));
    window.dispatchEvent(new Event('local-storage'));
  } catch (error) {
    console.warn(`Error removing localStorage key for "${address}"`);
  }
};

export const useCachedId = () => {
  const { address } = useDappStatus();

  return useLocalStorage<CachedOperatorRef | undefined>(
    address ? getCachedOperatorKey(address) : undefined,
    undefined,
    readTransform,
  );
};
