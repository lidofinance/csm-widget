import { useDappStatus } from '../hooks';
import { hasOperatorRole } from './has-operator-role';
import { useNodeOperator } from './node-operator-provider';

/** Active node operator, only when the wallet is its manager or rewards address. */
export const useOperatedNodeOperator = () => {
  const { address } = useDappStatus();
  const { nodeOperator } = useNodeOperator();
  return nodeOperator && hasOperatorRole(nodeOperator, address)
    ? nodeOperator
    : undefined;
};
