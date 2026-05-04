import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useLocalStorage } from 'shared/hooks';
import { useDappStatus } from '../hooks';
import { useSmSDK } from '../web3-provider';

export const useCachedId = () => {
  const { address } = useDappStatus();
  const {
    core: { moduleId },
  } = useSmSDK();

  return useLocalStorage<NodeOperatorId | undefined>(
    address ? `sm-${moduleId}-no-${address}` : undefined,
    undefined,
    BigInt,
  );
};
