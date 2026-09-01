import {
  useDappStatus,
  useIdvtcProof,
  useModule,
  useNodeOperatorId,
  useOperatorIsOwner,
} from 'modules/web3';

export const useCanClaimIDVTC = () => {
  const { isCSM } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const { address } = useDappStatus();
  const { data: proof } = useIdvtcProof();
  const { data: isOwner } = useOperatorIsOwner(nodeOperatorId);

  return Boolean(
    isCSM &&
    nodeOperatorId !== undefined &&
    address &&
    isOwner &&
    proof?.proof &&
    !proof.isConsumed,
  );
};
