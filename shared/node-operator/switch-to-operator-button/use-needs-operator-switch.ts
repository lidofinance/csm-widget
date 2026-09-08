import {
  OperatorRef,
  useAvailableOperators,
  useNodeOperator,
} from 'modules/web3';

const isSameOperator = (a: OperatorRef, b: OperatorRef | undefined) =>
  !!b && a.nodeOperatorId === b.nodeOperatorId && a.module === b.module;

export const useNeedsOperatorSwitch = (operator: OperatorRef) => {
  const { nodeOperator } = useNodeOperator();
  const { data: list } = useAvailableOperators();

  const isActive = isSameOperator(operator, nodeOperator);
  const isAvailable = list?.some((item) => isSameOperator(operator, item));

  return !(isActive || !isAvailable);
};
