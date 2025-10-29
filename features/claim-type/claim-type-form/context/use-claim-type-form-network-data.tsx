import {
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  KEY_OPERATOR_KEYS_TO_MIGRATE,
  useCurveParameters,
  useDappStatus,
  useIcsCurveId,
  useIcsPaused,
  useIcsProof,
  useNodeOperatorId,
  useOperatorCurveId,
  useOperatorIsOwner,
} from 'modules/web3';
import { useCallback, useMemo, useState } from 'react';
import { useCanClaimICS, useInvalidate } from 'shared/hooks';
import { type ClaimTypeFormNetworkData } from './types';

export const useClaimTypeFormNetworkData = (): [
  ClaimTypeFormNetworkData,
  () => Promise<void>,
] => {
  const [justClaimed, setJustClaimed] = useState(false);
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
  const { isPending: isIsOwnerLoading } = useOperatorIsOwner({
    address,
    nodeOperatorId,
  });

  const invalidate = useInvalidate();

  const {
    data: proof,
    isPending: isProofLoading,
    refetch: updateProof,
  } = useIcsProof(address);

  const canClaimCurve = useCanClaimICS();

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
    setJustClaimed(true);
  }, [invalidate, updateCurrentCurveId, updateProof]);

  const loading = useMemo(
    () => ({
      isIcsPausedLoading,
      isNewCurveIdLoading,
      isCurrentCurveIdLoading,
      isCurrentParametersLoading,
      isNewParametersLoading,
      isProofLoading,
      isIsOwnerLoading,
    }),
    [
      isIcsPausedLoading,
      isNewCurveIdLoading,
      isCurrentCurveIdLoading,
      isCurrentParametersLoading,
      isNewParametersLoading,
      isProofLoading,
      isIsOwnerLoading,
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
      justClaimed,
      loading,
    },
    revalidate,
  ];
};
