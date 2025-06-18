import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useOperatorCurveId } from './use-operator-curve-id';
import { OPERATOR_TYPE } from 'consts';
import { findKey } from 'lodash';

export const KNOWN_TYPES: { [key in OPERATOR_TYPE]?: bigint } = {
  [OPERATOR_TYPE.PERMISSIONLESS]: 0n,
  [OPERATOR_TYPE.EARLYADOPTER]: 1n,
  [OPERATOR_TYPE.ICS]: 2n,
};

export const getOperatorType = (
  curveId?: bigint,
): OPERATOR_TYPE | undefined => {
  if (curveId === undefined) {
    return undefined;
  }
  return (
    (findKey(KNOWN_TYPES, (id) => id === curveId) as OPERATOR_TYPE) ??
    OPERATOR_TYPE.CUSTOM
  );
};

export const useOperatorType = (id?: NodeOperatorId) => {
  return useOperatorCurveId(id, getOperatorType);
};
