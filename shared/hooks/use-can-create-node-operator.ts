import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
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

  const canCreateIdvtc =
    !isIdvtcPaused &&
    !!idvtcProof?.proof &&
    !idvtcProof.isConsumed &&
    idvtcCurveId !== undefined &&
    icsCurveId !== undefined &&
    nodeOperator?.curveId === icsCurveId;

  const canCreateIcs =
    !isIcsPaused &&
    !!icsProof?.proof &&
    !icsProof.isConsumed &&
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

  return { canCreate, creatableModules, isPending };
};
