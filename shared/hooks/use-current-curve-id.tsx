import {
  useDappStatus,
  useNodeOperatorId,
  useOperatorCurveId,
  useDefaultCurveId,
  useIcsCurveId,
  useIcsProof,
  useIcsPaused,
} from 'modules/web3';

export const useCurrentCurveId = () => {
  const { address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: operatorCurveId } = useOperatorCurveId(nodeOperatorId);
  const { data: defCurveId } = useDefaultCurveId();
  const { data: icsCurveId } = useIcsCurveId();
  const { data: proof } = useIcsProof(address);
  const { data: icsPaused } = useIcsPaused();

  return nodeOperatorId
    ? operatorCurveId
    : !icsPaused && proof?.proof && !proof.isConsumed
      ? icsCurveId
      : defCurveId;
};
