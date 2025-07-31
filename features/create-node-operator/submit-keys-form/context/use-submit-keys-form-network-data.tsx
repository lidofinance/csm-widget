import {
  useCsmStatus,
  useDappStatus,
  useEthereumBalance,
  useIcsCurveId,
  useIcsPaused,
  useIcsProof,
  usePermissionlessCurveId,
  useShareLimit,
  useShareLimitStatus,
  useStakeLimit,
  useStethBalance,
  useWstethBalance,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { useBlockNumber } from 'wagmi';
import { type SubmitKeysFormNetworkData } from './types';

export const useSubmitKeysFormNetworkData = (): [
  SubmitKeysFormNetworkData,
  () => Promise<void>,
] => {
  const { data: blockNumber, isLoading: isBlockNumberLoading } =
    useBlockNumber();
  const { data: status, isPending: isStatusLoading } = useCsmStatus();

  const {
    data: ethBalance,
    isPending: isEthBalanceLoading,
    refetch: ethBalanceUpdate,
  } = useEthereumBalance();
  const {
    data: stethBalance,
    isPending: isStethBalanceLoading,
    refetch: stethBalanceUpdate,
  } = useStethBalance();
  const {
    data: wstethBalance,
    isPending: isWstethBalanceLoading,
    refetch: wstethBalanceUpdate,
  } = useWstethBalance();

  const { address } = useDappStatus();
  const {
    data: proof,
    isPending: isProofLoading,
    refetch: updateProof,
  } = useIcsProof(address);
  const { data: isIcsPaused, isPending: isIcsPausedLoading } = useIcsPaused();
  const { data: plsCurveId, isPending: isPlsCurveIdLoading } =
    usePermissionlessCurveId();
  const { data: icsCurveId, isPending: isIcsCurveIdLoading } = useIcsCurveId();

  const isIcs = !isIcsPaused && proof?.proof && !proof.isConsumed;
  const curveId = isIcs ? icsCurveId : plsCurveId;

  const {
    data: shareLimit,
    isPending: isShareLimitLoading,
    refetch: shareLimitUpdate,
  } = useShareLimit();
  const { data: shareLimitStatus } = useShareLimitStatus();
  const {
    data: maxStakeEth,
    isPending: isMaxStakeEtherLoading,
    refetch: maxStakeEthUpdate,
  } = useStakeLimit();

  // const { data: keysAvailable } = useKeysAvailable({
  //   curveId,
  //   ethBalance,
  //   stethBalance,
  //   wstethBalance,
  // });
  const keysAvailable = undefined;

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      ethBalanceUpdate(),
      stethBalanceUpdate(),
      wstethBalanceUpdate(),
      shareLimitUpdate(),
      maxStakeEthUpdate(),
      updateProof(),
    ]);
  }, [
    ethBalanceUpdate,
    stethBalanceUpdate,
    wstethBalanceUpdate,
    shareLimitUpdate,
    maxStakeEthUpdate,
    updateProof,
  ]);

  const loading = useMemo(
    () => ({
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEthBalanceLoading,
      isMaxStakeEtherLoading,
      isBlockNumberLoading,
      isStatusLoading,
      isShareLimitLoading,
      isProofLoading,
      isIcsPausedLoading,
      isPlsCurveIdLoading,
      isIcsCurveIdLoading,
    }),
    [
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEthBalanceLoading,
      isMaxStakeEtherLoading,
      isBlockNumberLoading,
      isStatusLoading,
      isShareLimitLoading,
      isProofLoading,
      isIcsPausedLoading,
      isPlsCurveIdLoading,
      isIcsCurveIdLoading,
    ],
  );

  return [
    {
      address,
      blockNumber: blockNumber ? Number(blockNumber) : undefined,
      isPaused: status?.isPaused,
      proof: (isIcs && proof.proof) || undefined,
      stethBalance,
      wstethBalance,
      ethBalance,
      curveId,
      keysAvailable,
      maxStakeEth,
      shareLimit,
      shareLimitStatus,
      loading,
    },
    revalidate,
  ];
};
