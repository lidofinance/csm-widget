import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { getModuleOperatorType } from 'consts';
import { useOperatorCurveId } from './use-operator-curve-id';

export const useOperatorType = (id: NodeOperatorId | undefined) => {
  return useOperatorCurveId(id, (curveId) => getModuleOperatorType(curveId));
};
