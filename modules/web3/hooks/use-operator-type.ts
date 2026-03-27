import {
  getOperatorTypeByCurveId,
  NodeOperatorId,
} from '@lidofinance/lido-csm-sdk';
import { useOperatorCurveId } from './use-operator-curve-id';
import { useLidoSDK } from '../web3-provider';

export const useOperatorType = (id: NodeOperatorId | undefined) => {
  const { sm } = useLidoSDK();

  return useOperatorCurveId(id, (curveId) =>
    getOperatorTypeByCurveId(sm.core.moduleName, curveId),
  );
};
