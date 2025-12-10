import { CurveParameters } from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';
import { useCurrentCurveId } from 'shared/hooks';
import { canAddMorePriorityKeys } from 'utils/curve-parameters';
import { useNodeOperatorId } from '../operator-provider';
import { useCurveParameters } from './use-curve-parameters';
import { useOperatorInfo } from './use-operator-info';

export const useHasPriorityQueueSpots = () => {
  const nodeOperatorId = useNodeOperatorId();
  const curveId = useCurrentCurveId();
  const { data: operatorInfo } = useOperatorInfo(nodeOperatorId);

  const selectHasPrioritySpots = useCallback(
    (curveParameters: CurveParameters) => {
      if (nodeOperatorId !== undefined && operatorInfo) {
        return canAddMorePriorityKeys(operatorInfo, curveParameters);
      }
      return curveParameters.queueConfig.maxDeposits > 0;
    },
    [nodeOperatorId, operatorInfo],
  );

  return useCurveParameters(curveId, selectHasPrioritySpots);
};
