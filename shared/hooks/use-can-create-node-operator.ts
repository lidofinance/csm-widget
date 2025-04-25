import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useAccount } from './use-account';
import { useCsmPaused } from './useCsmStatus';

export const useCanCreateNodeOperator = () => {
  const { address } = useAccount();
  const nodeOperatorId = useNodeOperatorId();
  const { data: paused } = useCsmPaused();

  return Boolean(address && !nodeOperatorId && !paused?.isPaused);
};
