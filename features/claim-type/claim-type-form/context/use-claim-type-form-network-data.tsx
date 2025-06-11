import {
  useDappStatus,
  useIcsCanClaim,
  useIcsCurveId,
  useIcsProof,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { type ClaimTypeFormNetworkData } from './types';

export const useClaimTypeFormNetworkData = (): [
  ClaimTypeFormNetworkData,
  () => Promise<void>,
] => {
  const { address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId<true>();

  const {
    data: currentCurveId,
    isPending: isCurrentCurveIdLoading,
    refetch: updateCurrentCurveId,
  } = useOperatorCurveId(nodeOperatorId);
  const { data: curveId, isPending: isCurveIdLoading } = useIcsCurveId();

  const {
    data: proof,
    isPending: isProofLoading,
    refetch: updateProof,
  } = useIcsProof(address);
  const { data: canClaimCurve, isPending: isCanClaimCurveLoading } =
    useIcsCanClaim({ address, nodeOperatorId });

  // FIXME: invalidate every Parameters (based on type)
  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateCurrentCurveId(), updateProof()]);
  }, [updateCurrentCurveId, updateProof]);

  const loading = useMemo(
    () => ({
      isCurveIdLoading,
      isCurrentCurveIdLoading,
      isProofLoading,
      isCanClaimCurveLoading,
    }),
    [
      isCanClaimCurveLoading,
      isCurrentCurveIdLoading,
      isCurveIdLoading,
      isProofLoading,
    ],
  );

  return [
    {
      nodeOperatorId,
      address,
      curveId,
      currentCurveId,
      proof,
      canClaimCurve,
      loading,
    },
    revalidate,
  ];
};
