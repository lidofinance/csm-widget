import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useOperatorCurveId } from './use-operator-curve-id';
import { OPERATOR_TYPE } from 'consts';
import { findKey } from 'lodash';

export const KNOWN_TYPES: { [key in OPERATOR_TYPE]?: bigint } = {
  [OPERATOR_TYPE.PLS]: 0n,
  [OPERATOR_TYPE.LEA]: 1n,
  [OPERATOR_TYPE.ICS]: 2n,
};

export const getOperatorType = (
  curveId: bigint | undefined,
): OPERATOR_TYPE | undefined => {
  if (curveId === undefined) {
    return undefined;
  }
  return (
    (findKey(KNOWN_TYPES, (id) => id === curveId) as OPERATOR_TYPE) ??
    OPERATOR_TYPE.CC
  );
};

export const useOperatorType = (id: NodeOperatorId | undefined) => {
  return useOperatorCurveId(id, getOperatorType);
};
