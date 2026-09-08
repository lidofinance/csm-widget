import { useModuleOperatorTypeGetter } from 'shared/hooks';
import { OperatorRef } from '../operator-provider/types';
import { useOperatorCurveId } from './use-operator-curve-id';

export const useOperatorType = (operator: OperatorRef | undefined) => {
  const getOperatorType = useModuleOperatorTypeGetter();
  return useOperatorCurveId(operator, getOperatorType);
};
