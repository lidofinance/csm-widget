import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';

export type CreateOperatorRulesInput = {
  isAccountActive: boolean;
  /** Modules this deployment actually talks to. */
  deployedModules: MODULE_NAME[];
  pausedModules: Partial<Record<MODULE_NAME, boolean | undefined>>;
  /** Modules the wallet already holds an operator in. */
  operatorModules: MODULE_NAME[];
  /** Curve id of the currently selected operator, if any. */
  activeOperatorCurveId: bigint | undefined;
  icsEligible: boolean;
  idvtcEligible: boolean;
  icsCurveId: bigint | undefined;
  idvtcCurveId: bigint | undefined;
};

export const getCreatableTypes = (
  input: CreateOperatorRulesInput,
): OPERATOR_TYPE[] => {
  const {
    isAccountActive,
    deployedModules,
    pausedModules,
    operatorModules,
    activeOperatorCurveId,
    icsEligible,
    idvtcEligible,
    icsCurveId,
    idvtcCurveId,
  } = input;

  if (!isAccountActive) return [];

  const isModuleOpen = (module: MODULE_NAME) =>
    deployedModules.includes(module) && !pausedModules[module];

  const noCsmOperator = !operatorModules.includes(MODULE_NAME.CSM);
  const noCsm02Operator = !operatorModules.includes(MODULE_NAME.CSM_02);

  // The ICS<->IDVTC pair is the only sanctioned second CSM operator: each type
  // is reachable either from scratch or from an operator on the other curve.
  const isPairedWith = (curveId: bigint | undefined) =>
    noCsmOperator ||
    (curveId !== undefined && activeOperatorCurveId === curveId);

  const csmOpen = isModuleOpen(MODULE_NAME.CSM);

  return [
    csmOpen && noCsmOperator && OPERATOR_TYPE.CSM_DEF,
    csmOpen &&
      icsEligible &&
      icsCurveId !== undefined &&
      isPairedWith(idvtcCurveId) &&
      OPERATOR_TYPE.CSM_ICS,
    csmOpen &&
      idvtcEligible &&
      idvtcCurveId !== undefined &&
      isPairedWith(icsCurveId) &&
      OPERATOR_TYPE.CSM_IDVTC,
    isModuleOpen(MODULE_NAME.CSM_02) &&
      noCsm02Operator &&
      OPERATOR_TYPE.CSM2_DEF,
  ].filter((type): type is OPERATOR_TYPE => !!type);
};
