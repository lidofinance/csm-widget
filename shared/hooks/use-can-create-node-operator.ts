import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { config } from 'config';
import { deployedModules, isModuleDeployed } from 'consts';
import {
  useAvailableOperators,
  useCuratedGatesEligibility,
  useDappStatus,
  useIcsCurveId,
  useIcsPaused,
  useIcsProof,
  useIdvtcCurveId,
  useIdvtcPaused,
  useIdvtcProof,
  useNodeOperator,
  useSmStatus,
} from 'modules/web3';

export const useCanCreateNodeOperator = () => {
  const { isAccountActive } = useDappStatus();
  const { nodeOperator } = useNodeOperator();
  const { data: operators, isPending: isOperatorsPending } =
    useAvailableOperators();
  const { data: status, isPending: isStatusPending } = useSmStatus();

  const { data: gatesCount, isPending: isGatesPending } =
    useCuratedGatesEligibility(undefined, (data) => data.length);

  const { data: icsProof, isPending: isIcsProofPending } = useIcsProof();
  const { data: isIcsPaused, isPending: isIcsPausedPending } = useIcsPaused();
  const { data: icsCurveId, isPending: isIcsCurveIdPending } = useIcsCurveId();

  const { data: idvtcProof, isPending: isIdvtcProofPending } = useIdvtcProof();
  const { data: isIdvtcPaused, isPending: isIdvtcPausedPending } =
    useIdvtcPaused();
  const { data: idvtcCurveId, isPending: isIdvtcCurveIdPending } =
    useIdvtcCurveId();

  const isIcsEligible =
    !isIcsPaused && !!icsProof?.proof && !icsProof.isConsumed;
  const isIdvtcEligible =
    !isIdvtcPaused && !!idvtcProof?.proof && !idvtcProof.isConsumed;

  const canCreateIdvtc =
    isIdvtcEligible &&
    idvtcCurveId !== undefined &&
    icsCurveId !== undefined &&
    nodeOperator?.curveId === icsCurveId;

  const canCreateIcs =
    isIcsEligible &&
    icsCurveId !== undefined &&
    idvtcCurveId !== undefined &&
    nodeOperator?.curveId === idvtcCurveId;

  const hasOperatorIn = (module: MODULE_NAME) =>
    !!operators?.some((operator) => operator.module === module);

  const creatableModules = deployedModules.filter((module) => {
    if (module === MODULE_NAME.CM) {
      return gatesCount !== undefined && gatesCount > 0;
    }
    if (module === MODULE_NAME.CSM) {
      return !hasOperatorIn(MODULE_NAME.CSM) || canCreateIdvtc || canCreateIcs;
    }
    return isModuleDeployed(module) && !hasOperatorIn(module);
  });

  const isPending =
    isStatusPending ||
    (isAccountActive && isOperatorsPending) ||
    (config.module === MODULE_NAME.CSM
      ? isIcsProofPending ||
        isIcsPausedPending ||
        isIcsCurveIdPending ||
        isIdvtcProofPending ||
        isIdvtcPausedPending ||
        isIdvtcCurveIdPending
      : isGatesPending);

  const canCreate = Boolean(
    isAccountActive && !status?.isPaused && creatableModules.length > 0,
  );

  const isCsmCreatable = creatableModules.includes(MODULE_NAME.CSM);

  const creatableTypes = [
    isCsmCreatable && !hasOperatorIn(MODULE_NAME.CSM) && OPERATOR_TYPE.CSM_DEF,
    isCsmCreatable && isIcsEligible && OPERATOR_TYPE.CSM_ICS,
    isCsmCreatable && isIdvtcEligible && OPERATOR_TYPE.CSM_IDVTC,
    creatableModules.includes(MODULE_NAME.CSM_02) && OPERATOR_TYPE.CSM2_DEF,
  ].filter((type): type is OPERATOR_TYPE => !!type);

  return { canCreate, creatableModules, creatableTypes, isPending };
};
