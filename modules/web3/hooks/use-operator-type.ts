import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';
import { useOperatorCurveId } from './use-operator-curve-id';
import { OPERATOR_TYPE } from 'consts';

const getOperatorType = (curveId: bigint) => {
  switch (curveId) {
    case 0n:
      return OPERATOR_TYPE.DEFAULT as OPERATOR_TYPE;
    case 1n:
      return OPERATOR_TYPE.VETTED as OPERATOR_TYPE;
    default:
      return OPERATOR_TYPE.CUSTOM as OPERATOR_TYPE;
  }
};

export const useOperatorType = (id?: NodeOperatorId) => {
  return useOperatorCurveId(id, getOperatorType);
};
