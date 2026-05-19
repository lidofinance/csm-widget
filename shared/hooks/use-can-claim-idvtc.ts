import {
  useDappStatus,
  useIdvtcProof,
  useNodeOperatorId,
  useOperatorIsOwner,
} from 'modules/web3';

export const useCanClaimIDVTC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { address } = useDappStatus();
  const { data: proof } = useIdvtcProof();
  const { data: isOwner } = useOperatorIsOwner(nodeOperatorId);

  return Boolean(
    nodeOperatorId !== undefined &&
      address &&
      isOwner &&
      proof?.proof &&
      !proof.isConsumed,
  );
};
