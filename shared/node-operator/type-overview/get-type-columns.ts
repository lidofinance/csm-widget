import {
  CurveRef,
  MODULE_NAME,
  OPERATOR_TYPE,
  OPERATOR_TYPE_INFO,
} from '@lidofinance/lido-csm-sdk';

type Params = {
  type: OPERATOR_TYPE;
  operatorCurve: CurveRef | undefined;
  typeCurve: CurveRef | undefined;
  defCurve: CurveRef | undefined;
};

// CSM_DEF and CSM2_DEF share curveId 0n, so module must be compared too.
export const isSameCurve = (a?: CurveRef, b?: CurveRef) =>
  !!a && !!b && a.module === b.module && a.curveId === b.curveId;

export const getTypeColumns = ({
  type,
  operatorCurve,
  typeCurve,
  defCurve,
}: Params) => {
  const holdsTarget = isSameCurve(operatorCurve, typeCurve);

  if (OPERATOR_TYPE_INFO[type].module !== MODULE_NAME.CSM) {
    return {
      baseCurve: defCurve,
      baseCurrent: isSameCurve(operatorCurve, defCurve),
      baseOwnTitle: false,
      holdsTarget,
    };
  }

  const ownOther = operatorCurve?.module === MODULE_NAME.CSM && !holdsTarget;
  const baseCurve = ownOther ? operatorCurve : defCurve;
  return {
    baseCurve,
    baseCurrent: ownOther,
    baseOwnTitle: ownOther && !isSameCurve(baseCurve, defCurve),
    holdsTarget,
  };
};
