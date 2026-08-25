import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';
import { useLocalStorage } from 'shared/hooks';
import { useDappStatus } from '../hooks';
import { useSmSDK } from '../web3-provider';

export const getCachedOperatorKey = (moduleId: bigint, address: Address) =>
  `sm-${moduleId}-no-${address}`;

export const clearCachedOperatorId = (moduleId: bigint, address: Address) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(getCachedOperatorKey(moduleId, address));
    window.dispatchEvent(new Event('local-storage'));
  } catch (error) {
    console.warn(`Error removing localStorage key for "${address}"`);
  }
};

export const useCachedId = () => {
  const { address } = useDappStatus();
  const {
    core: { moduleId },
  } = useSmSDK();

  return useLocalStorage<NodeOperatorId | undefined>(
    address ? getCachedOperatorKey(moduleId, address) : undefined,
    undefined,
    BigInt,
  );
};
