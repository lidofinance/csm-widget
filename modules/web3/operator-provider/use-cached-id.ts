import { useLocalStorage } from 'shared/hooks';
import { useDappStatus } from '../hooks';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';

export const useCachedId = () => {
  const { address } = useDappStatus();

  const [value, setValue] = useLocalStorage<NodeOperatorId | undefined>(
    `csm-no-${address}`,
    undefined,
  );

  // TODO: move inside useLocalStorage
  const id = typeof value === 'string' ? BigInt(value) : value;

  return [id, setValue] as const;
};
