import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useModuleOperatorTypeGetter } from 'shared/hooks';
import { useOperatorCurveId } from './use-operator-curve-id';

export const useOperatorType = (id: NodeOperatorId | undefined) => {
  const getOperatorType = useModuleOperatorTypeGetter();
  return useOperatorCurveId(id, getOperatorType);
};
