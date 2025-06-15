import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useSessionStorage } from 'shared/hooks';

export const useOperatorCustomAddresses = () => {
  return useSessionStorage<NodeOperatorId | undefined>(
    `operator-custom-address`,
    undefined,
  );
};
