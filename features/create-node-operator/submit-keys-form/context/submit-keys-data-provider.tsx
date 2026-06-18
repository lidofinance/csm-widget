import {
  KEY_DEPOSIT_QUEUE_BATCHES,
  KEY_ICS_PROOF,
  KEY_IDVTC_PROOF,
  KEY_SHARE_LIMIT,
  KEY_STAKE_LIMIT,
  useCurveParameters,
  useDappStatus,
  useEthereumBalance,
  useShareLimit,
  useShareLimitStatus,
  useSmStatus,
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
import { useCreateCurveId, useInvalidate } from 'shared/hooks';
import { type SubmitKeysFormNetworkData } from './types';

const useSubmitKeysFormNetworkData: NetworkData<
  SubmitKeysFormNetworkData
> = () => {
  const { data: status, isPending: isStatusLoading } = useSmStatus();

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

  const { data: createData, isPending: isCurveIdPending } = useCreateCurveId();
  const { curveId, proof } = createData ?? {};

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
      KEY_IDVTC_PROOF,
      KEY_DEPOSIT_QUEUE_BATCHES,
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
    isCurveIdPending ||
    isCurveParametersLoading;

  return {
    data: {
      address,
      isPaused: status?.isPaused,
      proof: proof?.proof,
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
