import {
  useDefaultCurveId,
  useIcsCurveId,
  useIcsPaused,
  useIcsProof,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';

export const useCurrentCurveId = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: operatorCurveId } = useOperatorCurveId(nodeOperatorId);
  const { data: defCurveId } = useDefaultCurveId();
  const { data: icsCurveId } = useIcsCurveId();
  const { data: proof } = useIcsProof();
  const { data: icsPaused } = useIcsPaused();

  return nodeOperatorId
    ? operatorCurveId
    : !icsPaused && proof?.proof && !proof.isConsumed
      ? icsCurveId
      : defCurveId;
};
