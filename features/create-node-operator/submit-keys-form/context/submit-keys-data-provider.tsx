import {
  KEY_ICS_PROOF,
  KEY_SHARE_LIMIT,
  KEY_STAKE_LIMIT,
  useCsmStatus,
  useCurveParameters,
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
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { type SubmitKeysFormNetworkData } from './types';

const useSubmitKeysFormNetworkData: NetworkData<
  SubmitKeysFormNetworkData
> = () => {
  const { data: status, isPending: isStatusLoading } = useCsmStatus();

  const ethBalanceQuery = useEthereumBalance();
  const stethBalanceQuery = useStethBalance();
  const wstethBalanceQuery = useWstethBalance();
  const shareLimitQuery = useShareLimit();
  const maxStakeEthQuery = useStakeLimit();

  const ethBalance = ethBalanceQuery.data;
  const stethBalance = stethBalanceQuery.data;
  const wstethBalance = wstethBalanceQuery.data;
  const shareLimit = shareLimitQuery.data;
  const maxStakeEth = maxStakeEthQuery.data;

  const isEthBalanceLoading = ethBalanceQuery.isPending;
  const isStethBalanceLoading = stethBalanceQuery.isPending;
  const isWstethBalanceLoading = wstethBalanceQuery.isPending;
  const isShareLimitLoading = shareLimitQuery.isPending;
  const isMaxStakeEtherLoading = maxStakeEthQuery.isPending;

  const { address } = useDappStatus();
  const proofQuery = useIcsProof(address);

  const proof = proofQuery.data;
  const isProofLoading = proofQuery.isPending;

  const { data: isIcsPaused, isPending: isIcsPausedLoading } = useIcsPaused();
  const { data: plsCurveId, isPending: isPlsCurveIdLoading } =
    usePermissionlessCurveId();
  const { data: icsCurveId, isPending: isIcsCurveIdLoading } = useIcsCurveId();

  const isIcs = !isIcsPaused && proof?.proof && !proof.isConsumed;
  const curveId = isIcs ? icsCurveId : plsCurveId;

  const { data: curveParameters, isPending: isCurveParametersLoading } =
    useCurveParameters(curveId);

  const { data: shareLimitStatus } = useShareLimitStatus();

  // const { data: keysAvailable } = useKeysAvailable({
  //   curveId,
  //   ethBalance,
  //   stethBalance,
  //   wstethBalance,
  // });

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      ethBalanceQuery.queryKey,
      stethBalanceQuery.queryKey,
      wstethBalanceQuery.queryKey,
      KEY_SHARE_LIMIT,
      KEY_STAKE_LIMIT,
      KEY_ICS_PROOF,
    ]);
  }, [
    invalidate,
    ethBalanceQuery.queryKey,
    stethBalanceQuery.queryKey,
    wstethBalanceQuery.queryKey,
  ]);

  const isPending =
    isStethBalanceLoading ||
    isWstethBalanceLoading ||
    isEthBalanceLoading ||
    isMaxStakeEtherLoading ||
    isStatusLoading ||
    isShareLimitLoading ||
    isProofLoading ||
    isIcsPausedLoading ||
    isPlsCurveIdLoading ||
    isIcsCurveIdLoading ||
    isCurveParametersLoading;

  return {
    data: {
      address,
      isPaused: status?.isPaused,
      proof: (isIcs && proof.proof) || undefined,
      stethBalance,
      wstethBalance,
      ethBalance,
      curveId,
      curveParameters,
      maxStakeEth,
      shareLimit,
      shareLimitStatus,
      // keysAvailable,
    } as SubmitKeysFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useSubmitKeysFormData = useFormData<SubmitKeysFormNetworkData>;

export const SubmitKeysDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useSubmitKeysFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
