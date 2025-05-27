import { useCsmStatus } from 'modules/web3';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useAccount } from './use-account';

export const useCanCreateNodeOperator = () => {
  const { address } = useAccount();
  const nodeOperatorId = useNodeOperatorId();
  const { data: status } = useCsmStatus();

  return Boolean(address && !nodeOperatorId && !status?.isPaused);
};
