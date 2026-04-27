import {
  useDappStatus,
  useIcsProof,
  useNodeOperatorId,
  useOperatorIsOwner,
} from 'modules/web3';

export const useCanClaimICS = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { address } = useDappStatus();
  const { data: proof } = useIcsProof();
  const { data: isOwner } = useOperatorIsOwner(nodeOperatorId);

  return Boolean(
    nodeOperatorId !== undefined &&
      address &&
      isOwner &&
      proof?.proof &&
      !proof.isConsumed,
  );
};
