import {
  useDappStatus,
  useIcsProof,
  useModule,
  useNodeOperatorId,
  useOperatorIsOwner,
} from 'modules/web3';

export const useCanClaimICS = () => {
  const { isCSM } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const { address } = useDappStatus();
  const { data: proof } = useIcsProof();
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
