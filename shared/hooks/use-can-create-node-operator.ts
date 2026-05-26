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
  const { nodeOperator } = useNodeOperator();
  const { data: status } = useSmStatus();

  const { data: gatesCount } = useCuratedGatesEligibility(
    undefined,
    (data) => data.length,
  );

  const { data: icsProof } = useIcsProof();
  const { data: isIcsPaused } = useIcsPaused();
  const { data: icsCurveId } = useIcsCurveId();

  const { data: idvtcProof } = useIdvtcProof();
  const { data: isIdvtcPaused } = useIdvtcPaused();
  const { data: idvtcCurveId } = useIdvtcCurveId();

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

  return Boolean(isAccountActive && !status?.isPaused && condition);
};
