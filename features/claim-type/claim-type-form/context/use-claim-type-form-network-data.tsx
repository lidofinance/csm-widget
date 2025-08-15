import {
  useCurveParameters,
  useDappStatus,
  useIcsCanClaim,
  useIcsCurveId,
  useIcsPaused,
  useIcsProof,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorCurveId,
  useOperatorInfo,
  useOperatorKeysToMigrate,
  useOperatorKeysWithStatus,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
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
  } = useOperatorCurveId(nodeOperatorId, () => 1n);
  const { data: newCurveId, isPending: isNewCurveIdLoading } = useIcsCurveId();
  const { data: currentParameters, isPending: isCurrentParametersLoading } =
    useCurveParameters(currentCurveId);
  const { data: newParameters, isPending: isNewParametersLoading } =
    useCurveParameters(newCurveId);

  // TODO: invalidateQueries
  const { refetch: updateKeysToMigrate } =
    useOperatorKeysToMigrate(nodeOperatorId);
  const { refetch: updateBondBalance } = useOperatorBalance(nodeOperatorId);
  const { refetch: udpateInfo } = useOperatorInfo(nodeOperatorId);
  const { refetch: udpateKeys } = useOperatorKeysWithStatus(nodeOperatorId);

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
      updateKeysToMigrate(),
      updateBondBalance(),
      udpateInfo(),
      udpateKeys(),
    ]);
  }, [
    udpateInfo,
    udpateKeys,
    updateBondBalance,
    updateCurrentCurveId,
    updateKeysToMigrate,
    updateProof,
  ]);

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
