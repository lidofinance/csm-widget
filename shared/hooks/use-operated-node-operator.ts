import { useDappStatus, useNodeOperator } from 'modules/web3';
import { hasOperatorRole } from './can-create/rules';

/** Active node operator, only when the wallet is its manager or rewards address. */
export const useOperatedNodeOperator = () => {
  const { address } = useDappStatus();
  const { nodeOperator } = useNodeOperator();
  return nodeOperator && hasOperatorRole(nodeOperator, address)
    ? nodeOperator
    : undefined;
};
