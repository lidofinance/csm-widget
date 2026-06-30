import { isModuleCSM } from 'consts';
import {
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
  const { nodeOperator, isPending: isNodeOperatorPending } = useNodeOperator();
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

  const condition = isModuleCSM
    ? nodeOperator?.nodeOperatorId === undefined ||
      canCreateIdvtc ||
      canCreateIcs
    : gatesCount !== undefined && gatesCount > 0;

  const isPending =
    isStatusPending ||
    (isAccountActive && isNodeOperatorPending) ||
    (isModuleCSM
      ? isIcsProofPending ||
        isIcsPausedPending ||
        isIcsCurveIdPending ||
        isIdvtcProofPending ||
        isIdvtcPausedPending ||
        isIdvtcCurveIdPending
      : isGatesPending);

  const canCreate = Boolean(isAccountActive && !status?.isPaused && condition);

  return { canCreate, isPending };
};
