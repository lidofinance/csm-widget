import {
  useCurveParameters,
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
  } = useOperatorCurveId(nodeOperatorId, () => 1n);
  const { data: newCurveId, isPending: isNewCurveIdLoading } = useIcsCurveId();
  const { data: currentParameters, isPending: isCurrentParametersLoading } =
    useCurveParameters(currentCurveId);
  const { data: newParameters, isPending: isNewParametersLoading } =
    useCurveParameters(newCurveId);

  const {
    data: proof,
    isPending: isProofLoading,
    refetch: updateProof,
  } = useIcsProof(address);
  const { data: canClaimCurve, isPending: isCanClaimCurveLoading } =
    useIcsCanClaim({ address, nodeOperatorId });

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateCurrentCurveId(), updateProof()]);
  }, [updateCurrentCurveId, updateProof]);

  const loading = useMemo(
    () => ({
      isNewCurveIdLoading,
      isCurrentCurveIdLoading,
      isCurrentParametersLoading,
      isNewParametersLoading,
      isProofLoading,
      isCanClaimCurveLoading,
    }),
    [
      isCanClaimCurveLoading,
      isCurrentCurveIdLoading,
      isCurrentParametersLoading,
      isNewCurveIdLoading,
      isNewParametersLoading,
      isProofLoading,
    ],
  );

  return [
    {
      nodeOperatorId,
      address,
      currentCurveId,
      currentParameters,
      newCurveId,
      newParameters,
      proof,
      canClaimCurve,
      loading,
    },
    revalidate,
  ];
};
