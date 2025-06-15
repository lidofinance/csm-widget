import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useOperatorCurveId } from './use-operator-curve-id';
import { OPERATOR_TYPE } from 'consts';

const getOperatorType = (curveId: bigint): OPERATOR_TYPE => {
  switch (curveId) {
    case 0n:
      return OPERATOR_TYPE.PERMISSIONLESS;
    case 1n:
      return OPERATOR_TYPE.EARLYADOPTER;
    case 2n:
      return OPERATOR_TYPE.ICS;
    default:
      return OPERATOR_TYPE.CUSTOM;
  }
};

export const useOperatorType = (id?: NodeOperatorId) => {
  return useOperatorCurveId(id, getOperatorType);
};
