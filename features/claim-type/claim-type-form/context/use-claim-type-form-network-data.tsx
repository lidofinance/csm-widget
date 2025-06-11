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

  const { data: currentCurveId, isPending: isCurrentCurveIdLoading } =
    useOperatorCurveId(nodeOperatorId);
  const { data: curveId, isPending: isCurveIdLoading } = useIcsCurveId();

  const { data: proof, isPending: isProofLoading } = useIcsProof(address);
  const { data: canClaimCurve, isPending: isCanClaimCurveLoading } =
    useIcsCanClaim({ address, nodeOperatorId });

  const revalidate = useCallback(async () => {
    // await Promise.allSettled([updateLockedBond(), updateEtherBalance()]);
  }, []);

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
