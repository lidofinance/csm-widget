import {
  useDappStatus,
  useIcsPaused,
  useIcsProof,
  useNodeOperatorId,
  useOperatorIsOwner,
} from 'modules/web3';
import { useMemo } from 'react';

export const useCanClaimICS = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { address } = useDappStatus();
  const { data: proof } = useIcsProof(address);
  const { data: isPaused } = useIcsPaused();
  const { data: isOwner } = useOperatorIsOwner({ address, nodeOperatorId });

  return useMemo(
    () =>
      Boolean(
        nodeOperatorId !== undefined &&
          address &&
          !isPaused &&
          isOwner &&
          proof?.proof &&
          !proof.isConsumed,
      ),
    [
      nodeOperatorId,
      address,
      isPaused,
      isOwner,
      proof?.proof,
      proof?.isConsumed,
    ],
  );
};
