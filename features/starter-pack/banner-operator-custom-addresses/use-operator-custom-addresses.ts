import { useSessionStorage } from 'shared/hooks';
import { NodeOperatorId } from 'types';

export const useOperatorCustomAddresses = () => {
  return useSessionStorage<NodeOperatorId | undefined>(
    `operator-custom-address`,
    undefined,
  );
};
