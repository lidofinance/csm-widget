import {
  useDappStatus,
  useNodeOperatorId,
  useOperatorIsOwner,
} from 'modules/web3';

// Structural shape shared by the ICS and IDVTC proof queries — both resolve to
// a `getProofAndConsumed` result and are read the same way here.
type ClaimProofQuery = {
  data?: { proof?: unknown; isConsumed?: boolean };
  isLoading: boolean;
};

// Shared body for useCanClaimICS/useCanClaimIDVTC: the two differ only in which
// proof query feeds them, so they pass it in and reuse this logic.
export const useCanClaimCurve = (
  proofQuery: ClaimProofQuery,
): { canClaim: boolean; isPending: boolean } => {
  const nodeOperatorId = useNodeOperatorId();
  const { address } = useDappStatus();
  const isOwnerQuery = useOperatorIsOwner(nodeOperatorId);

  return {
    canClaim: Boolean(
      nodeOperatorId !== undefined &&
        address &&
        isOwnerQuery.data &&
        proofQuery.data?.proof &&
        !proofQuery.data.isConsumed,
    ),
    // isLoading (isPending && isFetching) is true only while an ENABLED query
    // is actually loading — disabled queries (no address, no operator, CM
    // module) never fetch, so the flag stays a definite false
    isPending: proofQuery.isLoading || isOwnerQuery.isLoading,
  };
};
