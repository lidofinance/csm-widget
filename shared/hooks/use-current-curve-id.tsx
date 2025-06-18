import {
  useDappStatus,
  useNodeOperatorId,
  useOperatorCurveId,
  usePermissionlessCurveId,
  useIcsCurveId,
  useIcsProof,
  useIcsPaused,
} from 'modules/web3';

export const useCurrentCurveId = () => {
  const { address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: operatorCurveId } = useOperatorCurveId(nodeOperatorId);
  const { data: plsCurveId } = usePermissionlessCurveId();
  const { data: icsCurveId } = useIcsCurveId();
  const { data: proof } = useIcsProof(address);
  const { data: icsPaused } = useIcsPaused();

  return nodeOperatorId
    ? operatorCurveId
    : !icsPaused && proof?.proof && !proof.isConsumed
      ? icsCurveId
      : plsCurveId;
};
