import { useLocalStorage } from '@lido-sdk/react';
import { useAccount } from 'shared/hooks';
import { NodeOperatorId } from 'types';

export const useCachedId = () => {
  const { chainId, address } = useAccount();

  return useLocalStorage<NodeOperatorId | undefined>(
    `CSM-NO-${address}-${chainId}`,
    undefined,
  );
};
