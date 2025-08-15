import { useLocalStorage } from 'shared/hooks';
import { useDappStatus } from '../hooks';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export const useCachedId = () => {
  const { address } = useDappStatus();

  return useLocalStorage<NodeOperatorId | undefined>(
    address ? `csm-no-${address}` : undefined,
    undefined,
    BigInt,
  );
};
