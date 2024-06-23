import { useLocalStorage } from '@lido-sdk/react';
import { useAccount } from 'shared/hooks';
import { NodeOperatorId } from 'types';

export const useCachedId = () => {
  const { chainId, address } = useAccount();

  const [cachedId, setCachedId] = useLocalStorage<NodeOperatorId | undefined>(
    `CSM-NO-${address}-${chainId}`,
    undefined,
  );

  return [cachedId, setCachedId] as const;
};
