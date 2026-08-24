import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';

export const useNeedsOperatorSwitch = (nodeOperatorId: NodeOperatorId) => {
  const { nodeOperator } = useNodeOperator();
  const { data: list } = useAvailableOperators();

  const isActive = nodeOperator?.nodeOperatorId === nodeOperatorId;
  const isAvailable = list?.some(
    (operator) => operator.nodeOperatorId === nodeOperatorId,
  );

  return !(isActive || !isAvailable);
};
