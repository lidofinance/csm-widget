import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';
import { useOperatorCurveId } from './use-operator-curve-id';
import { OPERATOR_TYPE } from 'consts';

const getOperatorType = (curveId: bigint) => {
  switch (curveId) {
    case 0n:
      return OPERATOR_TYPE.DEFAULT;
    case 1n:
      return OPERATOR_TYPE.VETTED;
    default:
      return OPERATOR_TYPE.CUSTOM;
  }
};

export const useOperatorType = (id?: NodeOperatorId) => {
  return useOperatorCurveId(id, getOperatorType);
};
