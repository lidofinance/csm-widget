import {
  OPERATOR_TYPE,
  OPERATOR_TYPE_CURVE_ID,
} from '@lidofinance/lido-csm-sdk';
import { findKey } from 'lodash';

export const getCurveIdByOperatorType = (
  type?: OPERATOR_TYPE,
): bigint | undefined => {
  return type && OPERATOR_TYPE_CURVE_ID[type];
};

export const getOperatorType = (
  curveId: bigint | undefined,
): OPERATOR_TYPE | undefined => {
  if (curveId === undefined) {
    return undefined;
  }
  return (
    (findKey(
      OPERATOR_TYPE_CURVE_ID,
      (id) => id === curveId,
    ) as OPERATOR_TYPE) ?? OPERATOR_TYPE.CC
  );
};
