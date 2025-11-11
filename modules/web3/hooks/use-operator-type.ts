import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { getOperatorType } from 'utils';
import { useOperatorCurveId } from './use-operator-curve-id';

export const useOperatorType = (id: NodeOperatorId | undefined) => {
  return useOperatorCurveId(id, getOperatorType);
};
