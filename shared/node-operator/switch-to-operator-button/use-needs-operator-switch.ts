import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';

export const useNeedsOperatorSwitch = (
  nodeOperatorId: NodeOperatorId,
  module: MODULE_NAME,
) => {
  const { nodeOperator } = useNodeOperator();
  const { data: list } = useAvailableOperators();

  const isActive =
    nodeOperator?.nodeOperatorId === nodeOperatorId &&
    nodeOperator?.module === module;
  const isAvailable = list?.some(
    (operator) =>
      operator.nodeOperatorId === nodeOperatorId && operator.module === module,
  );

  return !(isActive || !isAvailable);
};
