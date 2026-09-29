import {
  OperatorRef,
  useAvailableOperators,
  useNodeOperator,
} from 'modules/web3';
import { isSameOperator } from '../utils';

export const useNeedsOperatorSwitch = (operator: OperatorRef) => {
  const { nodeOperator } = useNodeOperator();
  const { data: list } = useAvailableOperators();

  const isActive = isSameOperator(operator, nodeOperator);
  const isAvailable = list?.some((item) => isSameOperator(operator, item));

  return !(isActive || !isAvailable);
};
