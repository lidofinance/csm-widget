import {
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  KEY_OPERATOR_KEYS_TO_MIGRATE,
  useCurveParameters,
  useDappStatus,
  useIcsCanClaim,
  useIcsCurveId,
  useIcsPaused,
  useIcsProof,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { useInvalidate } from 'shared/hooks';
import { type ClaimTypeFormNetworkData } from './types';

export const useClaimTypeFormNetworkData = (): [
  ClaimTypeFormNetworkData,
  () => Promise<void>,
] => {
  const { address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId<true>();

  const { data: icsPaused, isPending: isIcsPausedLoading } = useIcsPaused();
  const {
    data: currentCurveId,
    isPending: isCurrentCurveIdLoading,
    refetch: updateCurrentCurveId,
  } = useOperatorCurveId(nodeOperatorId);
  const { data: newCurveId, isPending: isNewCurveIdLoading } = useIcsCurveId();
  const { data: currentParameters, isPending: isCurrentParametersLoading } =
    useCurveParameters(currentCurveId);
  const { data: newParameters, isPending: isNewParametersLoading } =
    useCurveParameters(newCurveId);

  const invalidate = useInvalidate();

  const {
    data: proof,
    isPending: isProofLoading,
    refetch: updateProof,
  } = useIcsProof(address);
  const { data: canClaimCurve, isPending: isCanClaimCurveLoading } =
    useIcsCanClaim({ address, nodeOperatorId });

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateCurrentCurveId(),
      updateProof(),
      invalidate([
        KEY_OPERATOR_INFO,
        KEY_OPERATOR_BALANCE,
        KEY_OPERATOR_KEYS,
        KEY_OPERATOR_KEYS_TO_MIGRATE,
      ]),
    ]);
  }, [invalidate, updateCurrentCurveId, updateProof]);

  const loading = useMemo(
    () => ({
      isIcsPausedLoading,
      isNewCurveIdLoading,
      isCurrentCurveIdLoading,
      isCurrentParametersLoading,
      isNewParametersLoading,
      isProofLoading,
      isCanClaimCurveLoading,
    }),
    [
      isIcsPausedLoading,
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
      icsPaused,
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
